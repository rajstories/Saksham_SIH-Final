// index.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize Bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// In-memory session store (simple for demo)
const sessions = {};

// /start command
bot.start((ctx) => {
  const uid = ctx.from.id;
  sessions[uid] = { step: 'identify' };
  ctx.reply("Hello! Who are you?");
});

// Handle "I am Trainer" and auth
bot.on('text', async (ctx) => {
  const uid = ctx.from.id;
  let msg = ctx.message.text.trim();
  const session = sessions[uid] || { step: 'identify' };

  if (session.step === 'identify') {
    if (msg.toLowerCase().includes('trainer')) {
      sessions[uid] = { step: 'auth' };
      ctx.reply("✅ Recognized as Trainer.\n\nPlease send your Trainer ID and Password like this:\n`T101 password123`");
    } else {
      ctx.reply("❌ Only trainers allowed. Say: 'I am Trainer'");
    }
    return;
  }

  if (session.step === 'auth') {
    // Remove quotes and extra spaces
    msg = msg.replace(/['"]/g, '');
    const parts = msg.split(' ').filter(p => p !== '');
    if (parts.length < 2) {
      return ctx.reply("❌ Format: `T101 password123` (no quotes, just space)");
    }

    const id = parts[0];
    const pwd = parts.slice(1).join(' ');

    console.log(`🔍 Authenticating: ID=${id}, Password=${pwd}`);

    const { data, error } = await supabase
      .from('trainers')
      .select('id, name')
      .eq('id', id)
      .eq('password', pwd)
      .single();

    if (error || !data) {
      console.error('❌ Auth failed:', error || 'No matching trainer');
      return ctx.reply("❌ Invalid ID or password. Try again.");
    }

    sessions[uid] = { step: 'authenticated', trainerId: data.id, name: data.name };
    ctx.reply(`✅ Welcome, ${data.name}!\n\nNow send a photo of your training session.`);
    return;
  }

  // Handle trainee count
  if (session.step === 'ask_trainees') {
    const num = parseInt(msg, 10);
    if (isNaN(num) || num <= 0) {
      return ctx.reply("❌ Please enter a valid number (e.g., 25)");
    }
    sessions[uid] = { ...session, step: 'ask_topic', traineesCount: num };
    ctx.reply("📚 What was the training topic? (e.g., Flood Response)");
    return;
  }

  // Handle training topic
  if (session.step === 'ask_topic') {
    sessions[uid] = { ...session, step: 'ask_location', topic: msg };
    ctx.reply("📍 Please share your location:", {
      reply_markup: {
        keyboard: [[{ text: "📍 Share Location", request_location: true }]],
        one_time_keyboard: true,
        resize_keyboard: true
      }
    });
    return;
  }
});

// Handle photo upload
bot.on('photo', async (ctx) => {
  const uid = ctx.from.id;
  const session = sessions[uid];

  if (!session || session.step !== 'authenticated') {
    return ctx.reply("⚠️ Please authenticate first. Send /start");
  }

  try {
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const photoUrl = fileLink.href;

    sessions[uid] = {
      ...session,
      step: 'ask_trainees',
      photoUrl: photoUrl
    };

    ctx.reply("📷 Photo received!\n\nHow many people were trained? (e.g., 25)");
  } catch (error) {
    console.error('📸 Photo error:', error);
    ctx.reply("❌ Failed to process photo. Please try again.");
  }
});

// Handle location → save report
bot.on('location', async (ctx) => {
  const uid = ctx.from.id;
  const session = sessions[uid];

  if (!session || session.step !== 'ask_location') {
    return ctx.reply("⚠️ Please complete the previous steps first.");
  }

  const { latitude, longitude } = ctx.message.location;

  try {
    const { error } = await supabase
      .from('training_reports')
      .insert({
        trainer_id: session.trainerId,
        trainees_count: session.traineesCount,
        topic: session.topic,
        latitude: latitude,
        longitude: longitude,
        photo_url: session.photoUrl,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('💾 Supabase insert error:', error);
      ctx.reply("❌ Failed to save report. Please try again.");
    } else {
      ctx.reply("✅ Training report submitted!\n\nPending approval by SDMA/NDMA.", {
        reply_markup: { remove_keyboard: true }
      });
      delete sessions[uid]; // clear session
    }
  } catch (err) {
    console.error('💥 Location handler error:', err);
    ctx.reply("❌ Unexpected error. Contact admin.");
  }
});

// Launch bot
bot.launch();
console.log("🚀 SAKSHAM Telegram Bot is running!");

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));