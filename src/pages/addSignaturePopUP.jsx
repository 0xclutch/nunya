import React, { useRef, useState, useEffect } from 'react';
import '../styles/addSignaturePopUP.css';
import { useAuth } from '../components/AuthContext';

const AddSignaturePopUp = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef(null);
  const { userData, saveCachedSignature } = useAuth();
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Set drawing properties
      context.strokeStyle = '#000000';
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  }, [isOpen]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get coordinates for both mouse and touch events
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get coordinates for both mouse and touch events
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const context = canvasRef.current.getContext('2d');
      context.closePath();
      setIsDrawing(false);
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const handleConfirm = () => {
    if (isEmpty) {
      alert('Please draw your signature first');
      return;
    }

    const canvas = canvasRef.current;
    
    // Convert canvas to image data URL
    const imageDataURL = canvas.toDataURL('image/png');
    
    // Convert data URL to blob for better handling
    fetch(imageDataURL)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' });
        
        // Create a preview URL
        const previewURL = URL.createObjectURL(blob);
        
        console.log('Signature captured:', {
          dataURL: imageDataURL,
          file: file,
          previewURL: previewURL,
          size: `${(blob.size / 1024).toFixed(2)} KB`
        });
        
        // Call the onSave callback with the signature data
        if (onSave) {
          onSave({
            dataURL: imageDataURL,
            file: file,
            previewURL: previewURL,
            blob: blob
          });
        }
        
        // Upload to Supabase storage
        return saveCachedSignature(file);
      })
      .then((uploadResult) => {
        console.log('Upload successful:', uploadResult);
        alert('Signature saved successfully!');
        onClose();
      })
      .catch(err => {
        console.error('Error processing signature:', err);
        alert(`Error: ${err.message || 'Failed to save signature. Please try again.'}`);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="signature-popup-overlay" onClick={onClose}>
      <div className="signature-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="signature-popup-header">
          <h2>Add Your Signature</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="signature-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="signature-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <div className="signature-placeholder">
            {isEmpty && <p>Sign here</p>}
          </div>
        </div>
        
        <div className="signature-popup-actions">
          <button className="reset-button" onClick={resetCanvas}>
            Reset
          </button>
          <button className="confirm-button" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSignaturePopUp;
