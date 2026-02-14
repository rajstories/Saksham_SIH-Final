import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Camera, Image as ImageIcon, Video, Trash2, Download, Upload } from 'lucide-react';
import { db } from '../lib/db';
import type { Media as MediaType } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { format } from 'date-fns';

export const Media: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaType[]>([]);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const { location: gpsLocation } = useGeolocation(true);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const events = await db.getActiveEvents();
    if (events.length > 0) {
      setActiveEvent(events[0].id);
      const mediaData = await db.getMediaByEvent(events[0].id);
      setMediaFiles(mediaData.sort((a, b) => b.timestamp - a.timestamp));
    }
  };

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    if (!event.target.files || !activeEvent) return;

    const file = event.target.files[0];
    if (!file) return;

    // Create thumbnail for photos
    let thumbnail: string | undefined;
    if (type === 'photo') {
      thumbnail = await createThumbnail(file);
    }

    const media: MediaType = {
      id: `media-${Date.now()}`,
      eventId: activeEvent,
      type,
      blob: file,
      thumbnail,
      timestamp: Date.now(),
      gps: gpsLocation ? {
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
      } : null,
      synced: false,
    };

    await db.addMedia(media);

    // Log activity
    await db.addActivity({
      id: `activity-${Date.now()}`,
      eventId: activeEvent,
      type: `${type}_captured`,
      description: `${type === 'photo' ? 'Photo' : 'Video'} captured`,
      timestamp: Date.now(),
      gps: media.gps,
      synced: false,
    });

    await loadMedia();
  };

  const createThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 200;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    // In a real app, you would delete from IndexedDB
    setMediaFiles(prev => prev.filter(m => m.id !== mediaId));
  };

  const handleDownload = (media: MediaType) => {
    const url = URL.createObjectURL(media.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${media.type}-${media.id}.${media.type === 'photo' ? 'jpg' : 'mp4'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const unsyncedCount = mediaFiles.filter(m => !m.synced).length;

  return (
    <Layout title="Media">
      <div className="space-y-4 pb-4">
        {/* Upload Queue Status */}
        {unsyncedCount > 0 && (
          <Card elevated className="bg-amber/10 border-amber">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-body">Pending Uploads</p>
                <p className="text-small text-gray-600">{unsyncedCount} files waiting to sync</p>
              </div>
              <Badge variant="warning">{unsyncedCount}</Badge>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Card
            onClick={() => cameraInputRef.current?.click()}
            className="text-center cursor-pointer hover:shadow-card-elevated transition-shadow"
          >
            <Camera size={32} className="mx-auto mb-2 text-saffron" />
            <p className="text-small font-medium">Camera</p>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleCapture(e, 'photo')}
              className="hidden"
            />
          </Card>

          <Card
            onClick={() => galleryInputRef.current?.click()}
            className="text-center cursor-pointer hover:shadow-card-elevated transition-shadow"
          >
            <ImageIcon size={32} className="mx-auto mb-2 text-indian-blue" />
            <p className="text-small font-medium">Gallery</p>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleCapture(e, 'photo')}
              className="hidden"
            />
          </Card>

          <Card
            onClick={() => videoInputRef.current?.click()}
            className="text-center cursor-pointer hover:shadow-card-elevated transition-shadow"
          >
            <Video size={32} className="mx-auto mb-2 text-indian-green" />
            <p className="text-small font-medium">Video</p>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              onChange={(e) => handleCapture(e, 'video')}
              className="hidden"
            />
          </Card>
        </div>

        {/* Media Gallery */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-section-header font-semibold">Media Gallery</h3>
            <p className="text-small text-gray-600">{mediaFiles.length} files</p>
          </div>

          {mediaFiles.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Camera size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-body text-gray-500">No media captured yet</p>
                <p className="text-small text-gray-400 mt-1">
                  Use the camera or gallery to add photos
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {mediaFiles.map((media) => (
                <div
                  key={media.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
                  onClick={() => setSelectedMedia(media)}
                >
                  {media.type === 'photo' ? (
                    <img
                      src={media.thumbnail || URL.createObjectURL(media.blob)}
                      alt="Media"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <Video size={32} className="text-white" />
                    </div>
                  )}
                  {!media.synced && (
                    <div className="absolute top-1 right-1">
                      <Upload size={16} className="text-white drop-shadow" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="flex items-center justify-between p-4 text-white">
            <div>
              <p className="text-small">
                {format(new Date(selectedMedia.timestamp), 'MMM dd, yyyy HH:mm')}
              </p>
              {selectedMedia.gps && (
                <p className="text-micro opacity-75">
                  {selectedMedia.gps.latitude.toFixed(6)}° N, {selectedMedia.gps.longitude.toFixed(6)}° E
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedMedia(null)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            {selectedMedia.type === 'photo' ? (
              <img
                src={URL.createObjectURL(selectedMedia.blob)}
                alt="Full size"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                src={URL.createObjectURL(selectedMedia.blob)}
                controls
                className="max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          <div className="p-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              icon={Download}
              variant="secondary"
              onClick={() => handleDownload(selectedMedia)}
              className="flex-1"
            >
              Download
            </Button>
            <Button
              icon={Trash2}
              variant="danger"
              onClick={() => {
                handleDelete(selectedMedia.id);
                setSelectedMedia(null);
              }}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};
