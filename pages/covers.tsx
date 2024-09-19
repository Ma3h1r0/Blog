import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import coversData from '../data/covers.json';

interface Cover {
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  description: string;
}

export async function getStaticProps() {
  const sortedCovers = coversData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return {
    props: {
      covers: sortedCovers,
    },
  };
}

export default function Covers({ covers }: { covers: Cover[] }) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [isPlaying, currentTrack, volume, isMuted]);

  const handlePlayPause = (index: number) => {
    if (currentTrack === index) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(index);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setProgress(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="w-full">
        <h1 className="text-3xl font-handwriting font-bold mb-8 text-amber-800 dark:text-amber-200">
          我的翻唱
        </h1>
        <div className="space-y-12">
          {covers.map((cover, index) => (
            <motion.div
              key={index}
              className="border-b border-amber-200 dark:border-gray-700 pb-8 last:border-b-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
                  <div className="relative w-48 h-48 mx-auto">
                    <Image
                      src={cover.coverImage}
                      alt={cover.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-serif font-semibold mb-2 text-amber-800 dark:text-amber-200">{cover.title}</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">原唱: {cover.artist}</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">{cover.description}</p>
                  <button
                    onClick={() => handlePlayPause(index)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon 
                      icon={currentTrack === index && isPlaying ? faPause : faPlay} 
                      className="mr-2 w-4 h-4"
                    />
                    <span className="align-middle">{currentTrack === index && isPlaying ? '暂停' : '播放'}</span>
                  </button>
                  {currentTrack === index && (
                    <div className="mt-4">
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        value={progress}
                        onChange={handleProgressChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-amber-700 dark:text-amber-300">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <button onClick={toggleMute} className="mr-2">
                          <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-24"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <audio
        ref={audioRef}
        src={currentTrack !== null ? covers[currentTrack].audioUrl : ''}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      />
    </Layout>
  );
}