import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CameraModal({ open, onClose, mode, onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let currentStream;
    async function init() {
      if (!open) return;
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
          await videoRef.current.play();
        }
      } catch (e) {
        console.error(e);
      }
    }
    init();

    return () => {
      if (currentStream) currentStream.getTracks().forEach(t => t.stop());
      setStream(null);
      setPreview(null);
    };
  }, [open]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPreview(dataUrl);
    onCapture?.(dataUrl);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {!preview ? (
              <div className="relative w-full h-full">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <div className="absolute inset-x-0 bottom-14 flex items-center justify-center">
                  <button
                    onClick={handleCapture}
                    className="h-16 w-16 rounded-full border border-white/40 bg-white/5 backdrop-blur-xl"
                    aria-label="Capture"
                  >
                    <span className="sr-only">Capture</span>
                  </button>
                </div>
                <div className="absolute inset-x-0 top-8 text-center text-white/70 text-sm">
                  {mode === "product" ? "Richte den Barcode mittig aus" : "Halte das Motiv ruhig"}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full">
                <img src={preview} alt="Preview" className="w-full h-full object-contain bg-black" />
                <div className="absolute inset-x-0 bottom-10 flex gap-4 justify-center">
                  <button onClick={() => setPreview(null)} className="px-5 py-2 rounded-full bg-white/10 text-white border border-white/20">Neu</button>
                  <button onClick={onClose} className="px-5 py-2 rounded-full bg-white text-black">Weiter</button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
