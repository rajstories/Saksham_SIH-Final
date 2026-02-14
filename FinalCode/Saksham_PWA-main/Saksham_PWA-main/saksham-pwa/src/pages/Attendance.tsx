import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { QrCode, CheckCircle } from 'lucide-react';
import { db } from '../lib/db';
import type { Trainee, Attendance as AttendanceType } from '../types';
import { Html5Qrcode } from 'html5-qrcode';

type TabMode = 'manual' | 'qr';

export const Attendance: React.FC = () => {
  const [mode, setMode] = useState<TabMode>('manual');
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceType>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (mode === 'qr' && qrReaderRef.current && !qrScannerRef.current) {
      initQRScanner();
    }
    return () => {
      stopQRScanner();
    };
  }, [mode]);

  const loadData = async () => {
    // Load mock trainees for demo
    const mockTrainees: Trainee[] = Array.from({ length: 30 }, (_, i) => ({
      id: `trainee-${i + 1}`,
      name: `Trainee ${i + 1}`,
      phone: `+91 98765${String(i + 1).padStart(5, '0')}`,
    }));

    setTrainees(mockTrainees);

    // Load active event
    const events = await db.getActiveEvents();
    if (events.length > 0) {
      setActiveEvent(events[0].id);
      const existingAttendance = await db.getAttendanceByEvent(events[0].id);
      const attendanceMap = new Map(existingAttendance.map(a => [a.traineeId, a]));
      setAttendance(attendanceMap);
    }
  };

  const initQRScanner = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      qrScannerRef.current = scanner;
    } catch (error) {
      console.error('Error initializing QR scanner:', error);
    }
  };

  const startQRScanner = async () => {
    if (!qrScannerRef.current) return;

    try {
      setIsScanning(true);
      await qrScannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onQRScanned,
        () => { }
      );
    } catch (error) {
      console.error('Error starting QR scanner:', error);
      setIsScanning(false);
    }
  };

  const stopQRScanner = async () => {
    if (qrScannerRef.current && isScanning) {
      try {
        await qrScannerRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error('Error stopping QR scanner:', error);
      }
    }
  };

  const onQRScanned = (decodedText: string) => {
    // Parse QR code to get trainee ID
    const trainee = trainees.find(t => decodedText.includes(t.id));
    if (trainee && activeEvent) {
      markAttendance(trainee.id, 'qr');
      setTimeout(startQRScanner, 1000); // Restart scanner after 1 second
    }
  };

  const markAttendance = async (traineeId: string, method: 'manual' | 'qr') => {
    if (!activeEvent) {
      alert('No active event found');
      return;
    }

    const trainee = trainees.find(t => t.id === traineeId);
    if (!trainee) return;

    const attendanceRecord: AttendanceType = {
      id: `attendance-${Date.now()}`,
      eventId: activeEvent,
      traineeId: trainee.id,
      traineeName: trainee.name,
      status: 'present',
      timestamp: Date.now(),
      method,
      synced: false,
    };

    await db.addAttendance(attendanceRecord);
    setAttendance(prev => new Map(prev.set(traineeId, attendanceRecord)));

    // Log activity
    await db.addActivity({
      id: `activity-${Date.now()}`,
      eventId: activeEvent,
      type: 'attendance_marked',
      description: `${trainee.name} marked present via ${method}`,
      timestamp: Date.now(),
      gps: null,
      synced: false,
    });
  };

  const markAllPresent = async () => {
    if (!activeEvent) return;

    for (const trainee of trainees) {
      if (!attendance.has(trainee.id)) {
        await markAttendance(trainee.id, 'manual');
      }
    }
  };

  const filteredTrainees = trainees.filter(trainee => {
    const matchesSearch = trainee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isPresent = attendance.has(trainee.id);

    if (filter === 'present' && !isPresent) return false;
    if (filter === 'absent' && isPresent) return false;

    return matchesSearch;
  });

  const stats = {
    total: trainees.length,
    present: attendance.size,
    absent: trainees.length - attendance.size,
    percentage: trainees.length > 0 ? Math.round((attendance.size / trainees.length) * 100) : 0,
  };

  return (
    <Layout title="Attendance">
      <div className="space-y-4 pb-4">
        {/* Stats Card */}
        <Card elevated>
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-indian-green mb-1">{stats.present}/{stats.total}</p>
            <p className="text-body text-gray-600">Trainees Present ({stats.percentage}%)</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center text-small">
            <div>
              <p className="text-2xl font-bold text-indian-green">{stats.present}</p>
              <p className="text-gray-600">Present</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-danger-red">{stats.absent}</p>
              <p className="text-gray-600">Absent</p>
            </div>
          </div>
        </Card>

        {/* Mode Toggle */}
        <div className="flex bg-gray-200 rounded-button p-1">
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 rounded-button transition-all ${mode === 'manual'
              ? 'bg-white shadow text-indian-blue font-medium'
              : 'text-gray-600'
              }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setMode('qr')}
            className={`flex-1 py-2 rounded-button transition-all ${mode === 'qr'
              ? 'bg-white shadow text-indian-blue font-medium'
              : 'text-gray-600'
              }`}
          >
            QR Scan
          </button>
        </div>

        {mode === 'manual' ? (
          <>
            {/* Search and Filter */}
            <div className="space-y-3">
              <Input
                placeholder="Search trainee name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />

              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('all')}
                  className="flex-1 h-10 text-small"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'present' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('present')}
                  className="flex-1 h-10 text-small"
                >
                  Present
                </Button>
                <Button
                  variant={filter === 'absent' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('absent')}
                  className="flex-1 h-10 text-small"
                >
                  Absent
                </Button>
              </div>

              <Button
                variant="success"
                onClick={markAllPresent}
                fullWidth
                className="h-10"
              >
                Mark All Present
              </Button>
            </div>

            {/* Trainee List */}
            <div className="space-y-2">
              {filteredTrainees.map((trainee) => {
                const isPresent = attendance.has(trainee.id);
                return (
                  <Card key={trainee.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indian-blue/10 flex items-center justify-center text-indian-blue font-medium">
                        {trainee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-body">{trainee.name}</p>
                        <p className="text-micro text-gray-500">{trainee.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPresent ? (
                        <div className="flex items-center gap-2 text-indian-green">
                          <CheckCircle size={20} />
                          <span className="text-small font-medium">Present</span>
                        </div>
                      ) : (
                        <Button
                          variant="success"
                          onClick={() => markAttendance(trainee.id, 'manual')}
                          className="h-10 text-small"
                        >
                          Mark Present
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* QR Scanner Mode */}
            <div className="space-y-4">
              <div id="qr-reader" ref={qrReaderRef} className="rounded-card overflow-hidden" />

              {!isScanning ? (
                <Button
                  icon={QrCode}
                  variant="secondary"
                  onClick={startQRScanner}
                  fullWidth
                  className="h-16 bg-gradient-to-r from-saffron to-amber"
                >
                  Start QR Scanner
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={stopQRScanner}
                  fullWidth
                  className="h-16"
                >
                  Stop Scanning
                </Button>
              )}

              <Card className="bg-blue-50 border-blue-200">
                <p className="text-small text-blue-900">
                  <strong>How to use:</strong> Hold the QR code in front of the camera.
                  The system will automatically detect and mark attendance.
                </p>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
