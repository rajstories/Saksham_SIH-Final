# Saksham Telegram Bot

## 🎯 Overview

The **Saksham Telegram Bot** provides instant disaster alerts and information through Telegram messaging platform. Users can receive automated notifications, query disaster information, and access emergency resources through simple chat commands.

## 🌟 Key Features

- 🤖 **Automated Alerts** - Instant disaster notifications
- 📍 **Location-Based** - Alerts filtered by user location
- 💬 **Interactive Commands** - Easy chat-based interface
- 🔔 **Real-time Updates** - Live disaster information
- 🌐 **Multi-language** - Support for multiple languages
- 📊 **Data Integration** - Connected to Supabase backend
- 🆓 **Free Access** - No cost for users

## 📁 Project Structure

```
saksham-telegram-bot/
├── index.js              # Main bot logic
├── .env                  # Environment variables
├── package.json          # Dependencies
└── node_modules/         # Installed packages
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- Telegram Bot Token (from @BotFather)
- Supabase account and credentials

### Installation

1. **Navigate to project directory**
   ```bash
   cd saksham-telegram-bot/saksham-telegram-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create `.env` file:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Get Telegram Bot Token**
   - Open Telegram and search for @BotFather
   - Send `/newbot` command
   - Follow instructions to create bot
   - Copy the token provided

5. **Setup Supabase**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Get URL and anon key from project settings

6. **Start the bot**
   ```bash
   node index.js
   ```

## 🛠️ Technology Stack

- **Telegram** v4.16.3 - Telegram bot framework
- **Supabase JS** v2.86.0 - Backend database client
- **dotenv** v17.2.3 - Environment configuration

## 🤖 Bot Commands

### Start & Help
```
/start - Welcome message and setup
/help - List all available commands
/about - Information about SAKSHAM
```

### Alerts
```
/alerts - Get latest disaster alerts
/critical - Critical alerts only
/subscribe - Subscribe to location alerts
/unsubscribe - Stop receiving alerts
```

### Location
```
/location - Set your location
/nearby - Get nearby disasters
/safe - Find safe zones near you
```

### Emergency
```
/emergency - Emergency contact numbers
/shelter - Find nearest shelters
/hospital - Find nearest hospitals
/tips - Disaster safety tips
```

### Settings
```
/language - Change language
/settings - View/update preferences
```

## 💬 Chat Flow Examples

### First Time User
```
User: /start

Bot: 🙏 Welcome to SAKSHAM!

I'm your disaster alert assistant. I'll keep you informed about disasters and emergencies in your area.

To get started, please share your location:
/location - Set your location

Or browse:
/alerts - Latest alerts
/help - All commands
```

### Getting Alerts
```
User: /alerts

Bot: 📢 Latest Disaster Alerts

🔴 CRITICAL - Flood Alert
📍 Patna, Bihar
🕐 2 hours ago
Heavy rainfall expected. Evacuate low-lying areas.
/alert_123 - More details

🟠 HIGH - Earthquake Warning
📍 Delhi NCR
🕐 5 hours ago
Magnitude 5.2 tremors detected.
/alert_124 - More details

Type /critical for critical alerts only
```

### Location Subscribe
```
User: /subscribe

Bot: ✅ Subscription Activated!

You'll now receive alerts for:
📍 Location: Mumbai, Maharashtra
🔔 Severity: All levels

To change:
/location - Update location
/settings - Modify preferences
/unsubscribe - Stop alerts
```

## 🔧 Implementation

### Basic Bot Setup
```javascript
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Start command
bot.start((ctx) => {
  ctx.reply('Welcome to SAKSHAM! 🙏\n\nType /help for commands.');
});

// Help command
bot.help((ctx) => {
  ctx.reply(`
📋 Available Commands:

🚨 Alerts:
/alerts - Latest alerts
/critical - Critical only
/subscribe - Get notifications

📍 Location:
/location - Set location
/nearby - Nearby disasters

🆘 Emergency:
/emergency - Contact numbers
/shelter - Find shelters

⚙️ Settings:
/settings - Preferences
/language - Change language
  `);
});

bot.launch();
```

### Fetching Alerts from Supabase
```javascript
bot.command('alerts', async (ctx) => {
  try {
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    if (alerts.length === 0) {
      return ctx.reply('✅ No active alerts in your area.');
    }

    let message = '📢 Latest Disaster Alerts:\n\n';
    
    alerts.forEach((alert, index) => {
      const emoji = getSeverityEmoji(alert.severity);
      message += `${emoji} ${alert.title}\n`;
      message += `📍 ${alert.location}\n`;
      message += `🕐 ${formatTime(alert.created_at)}\n`;
      message += `${alert.description}\n\n`;
    });

    ctx.reply(message);
  } catch (error) {
    ctx.reply('❌ Error fetching alerts. Please try again.');
  }
});

function getSeverityEmoji(severity) {
  const emojis = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢'
  };
  return emojis[severity] || '⚪';
}
```

### Location-Based Alerts
```javascript
bot.command('location', (ctx) => {
  ctx.reply('📍 Please share your location:', {
    reply_markup: {
      keyboard: [[{
        text: '📍 Share Location',
        request_location: true
      }]],
      one_time_keyboard: true,
      resize_keyboard: true
    }
  });
});

bot.on('location', async (ctx) => {
  const { latitude, longitude } = ctx.message.location;
  const userId = ctx.from.id;

  // Save user location to database
  const { error } = await supabase
    .from('user_locations')
    .upsert({
      user_id: userId,
      latitude: latitude,
      longitude: longitude,
      updated_at: new Date()
    });

  if (error) {
    return ctx.reply('❌ Error saving location.');
  }

  ctx.reply('✅ Location saved! You\'ll receive alerts for this area.\n\nType /subscribe to enable notifications.');
});
```

### Subscription Management
```javascript
bot.command('subscribe', async (ctx) => {
  const userId = ctx.from.id;

  const { data: location } = await supabase
    .from('user_locations')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!location) {
    return ctx.reply('📍 Please set your location first using /location');
  }

  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      telegram_chat_id: ctx.chat.id,
      is_active: true,
      updated_at: new Date()
    });

  if (error) {
    return ctx.reply('❌ Subscription failed. Try again.');
  }

  ctx.reply('✅ Subscribed! You\'ll receive disaster alerts.\n\nType /unsubscribe to stop.');
});

bot.command('unsubscribe', async (ctx) => {
  const userId = ctx.from.id;

  await supabase
    .from('subscriptions')
    .update({ is_active: false })
    .eq('user_id', userId);

  ctx.reply('✅ Unsubscribed. Type /subscribe to re-enable alerts.');
});
```

### Broadcasting Alerts
```javascript
async function broadcastAlert(alert) {
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('telegram_chat_id')
    .eq('is_active', true);

  for (const sub of subscriptions) {
    try {
      const emoji = getSeverityEmoji(alert.severity);
      const message = `
${emoji} ${alert.severity.toUpperCase()} ALERT

${alert.title}

📍 Location: ${alert.location}
🕐 Time: ${new Date().toLocaleString()}

${alert.description}

Stay safe! 🙏
      `;

      await bot.telegram.sendMessage(sub.telegram_chat_id, message);
    } catch (error) {
      console.error(`Failed to send to ${sub.telegram_chat_id}:`, error);
    }
  }
}

// Trigger broadcast when new alert is created
// (In production, use webhooks or polling)
```

## 🌐 Multi-Language Support

```javascript
const messages = {
  en: {
    welcome: 'Welcome to SAKSHAM!',
    helpText: 'Available Commands:...',
    noAlerts: 'No active alerts.'
  },
  hi: {
    welcome: 'साक्षम में आपका स्वागत है!',
    helpText: 'उपलब्ध कमांड:...',
    noAlerts: 'कोई सक्रिय अलर्ट नहीं।'
  }
};

bot.command('language', (ctx) => {
  ctx.reply('Choose language / भाषा चुनें:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'English', callback_data: 'lang_en' }],
        [{ text: 'हिंदी', callback_data: 'lang_hi' }],
        [{ text: 'বাংলা', callback_data: 'lang_bn' }]
      ]
    }
  });
});

bot.action(/lang_(.+)/, async (ctx) => {
  const lang = ctx.match[1];
  const userId = ctx.from.id;

  await supabase
    .from('user_preferences')
    .upsert({ user_id: userId, language: lang });

  ctx.answerCbQuery();
  ctx.reply(`✅ Language updated to ${lang}`);
});
```

## 📊 Database Schema

### Supabase Tables

```sql
-- user_locations table
CREATE TABLE user_locations (
  user_id BIGINT PRIMARY KEY,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  district TEXT,
  state TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id BIGINT,
  telegram_chat_id BIGINT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT,
  severity TEXT,
  title TEXT,
  description TEXT,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔔 Inline Keyboards

```javascript
bot.command('menu', (ctx) => {
  ctx.reply('Select an option:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📢 Alerts', callback_data: 'alerts' },
          { text: '🔴 Critical', callback_data: 'critical' }
        ],
        [
          { text: '📍 Location', callback_data: 'location' },
          { text: '🆘 Emergency', callback_data: 'emergency' }
        ],
        [
          { text: '⚙️ Settings', callback_data: 'settings' }
        ]
      ]
    }
  });
});

// Handle button clicks
bot.action('alerts', (ctx) => {
  ctx.answerCbQuery();
  // Trigger alerts command logic
});
```

## 🚀 Deployment

### Option 1: Heroku
```bash
# Install Heroku CLI
heroku create saksham-bot
git push heroku main
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
```

### Option 2: Railway
```bash
# Install Railway CLI
railway init
railway up
# Set environment variables in dashboard
```

### Option 3: VPS (DigitalOcean, AWS EC2)
```bash
# SSH to server
git clone <repository>
cd saksham-telegram-bot
npm install
pm2 start index.js --name saksham-bot
pm2 save
```

## 📈 Analytics & Monitoring

```javascript
// Track bot usage
bot.use((ctx, next) => {
  console.log(`User ${ctx.from.id} used /${ctx.updateType}`);
  
  // Log to database
  supabase.from('bot_analytics').insert({
    user_id: ctx.from.id,
    command: ctx.updateType,
    timestamp: new Date()
  });
  
  return next();
});
```

## 🔐 Security

- Never commit `.env` file
- Use environment variables for secrets
- Validate user input
- Rate limit commands
- Sanitize database queries

## 🐛 Troubleshooting

### Bot Not Responding
```bash
# Check if bot is running
# Verify bot token
# Check network connectivity
# Review logs for errors
```

### Database Connection Failed
```bash
# Verify Supabase credentials
# Check network access
# Review Supabase dashboard for issues
```

### Commands Not Working
```bash
# Restart bot
# Clear Telegram cache
# Check command syntax
# Review bot logs
```

## 📚 Resources

- [Telegraf Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)

## 🎯 Use Cases

### Emergency Situations
- Instant critical alerts
- Location-based warnings
- Emergency contact access
- Real-time updates

### Daily Monitoring
- Weather updates
- Disaster forecasts
- Safety advisories
- Community alerts

### Information Queries
- Historical data
- Disaster statistics
- Safety guidelines
- Resource locations

## 🚀 Future Enhancements

- Voice message support
- Image/video alerts
- Group chat integration
- Admin dashboard
- Analytics reporting
- Custom alert filters
- Webhook integration

---

**Part of SAKSHAM - SIH 2025 Project**
