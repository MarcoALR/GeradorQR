import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [mostrarQR, setMostrarQR] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  
  const [qrRadius, setQrRadius] = useState(0); 

  const [rawLogo, setRawLogo] = useState(null);
  const [processedLogo, setProcessedLogo] = useState(null);
  const [logoWidth, setLogoWidth] = useState(60);
  const [logoHeight, setLogoHeight] = useState(60);
  const [logoRadius, setLogoRadius] = useState(0);
  const [logoPadding, setLogoPadding] = useState(0);
  const [recortarFundo, setRecortarFundo] = useState(true);

  const qrRef = useRef(null);
  
  const maxLogoDim = Math.floor(size * 0.28); 

  const qrMargin = Math.floor(size * 0.1); 

  useEffect(() => {
    if (logoWidth > maxLogoDim) setLogoWidth(maxLogoDim);
    if (logoHeight > maxLogoDim) setLogoHeight(maxLogoDim);
  }, [size, maxLogoDim, logoWidth, logoHeight]);

  useEffect(() => {
    if (!rawLogo) return;

    const timer = setTimeout(() => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = logoWidth;
        canvas.height = logoHeight;
        const ctx = canvas.getContext("2d");
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const p = logoPadding;
        const w = logoWidth - (p * 2);
        const h = logoHeight - (p * 2);

        if (w > 0 && h > 0) {
          const maxRadius = Math.min(w, h) / 2;
          const r = (logoRadius / 100) * maxRadius;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p + r, p);
          ctx.lineTo(p + w - r, p);
          ctx.quadraticCurveTo(p + w, p, p + w, p + r);
          ctx.lineTo(p + w, p + h - r);
          ctx.quadraticCurveTo(p + w, p + h, p + w - r, p + h);
          ctx.lineTo(p + r, p + h);
          ctx.quadraticCurveTo(p, p + h, p, p + h - r);
          ctx.lineTo(p, p + r);
          ctx.quadraticCurveTo(p, p, p + r, p);
          ctx.closePath();
          ctx.clip();
          
          ctx.drawImage(img, p, p, w, h);
          ctx.restore();
        }

        setProcessedLogo(canvas.toDataURL("image/png"));
      };
      img.src = rawLogo;
    }, 100);

    return () => clearTimeout(timer);
  }, [rawLogo, logoWidth, logoHeight, logoRadius, logoPadding]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRawLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const baixarQRCode = () => {
    const qrCanvas = qrRef.current.querySelector("canvas");
    if (!qrCanvas) return;

    const finalSize = size + (qrMargin * 2);
    
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = finalSize;
    finalCanvas.height = finalSize;
    const ctx = finalCanvas.getContext("2d");

    const r = (qrRadius / 100) * (finalSize / 2);
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(finalSize - r, 0);
    ctx.quadraticCurveTo(finalSize, 0, finalSize, r);
    ctx.lineTo(finalSize, finalSize - r);
    ctx.quadraticCurveTo(finalSize, finalSize, finalSize - r, finalSize);
    ctx.lineTo(r, finalSize);
    ctx.quadraticCurveTo(0, finalSize, 0, finalSize - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    ctx.drawImage(qrCanvas, qrMargin, qrMargin);

    const url = finalCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code-profissional.png";
    link.click();
  };

  return (
    <div className="container">
      <header className="hero-section">
        <h1>Gerador de QR Code</h1>
        <p>Crie QRs profissionais com sua marca, sem quebrar a leitura. Nunca expira, sem custos adicionais.</p>
      </header>

      <div className="editor-grid">
        <aside className="controls">
          <div className="input-group">
            <label>Link ou Conteúdo</label>
            <input
              type="text"
              placeholder="https://seusite.com"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (e.target.value) setMostrarQR(true);
              }}
            />
          </div>

          <div className="control-card">
            <h3>🎨 Estilo e Cor</h3>
            <div className="flex-row">
              <div className="color-field">
                <span>QR</span>
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
              </div>
              <div className="color-field">
                <span>Fundo</span>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>
            </div>

            <div className="slider-row">
              <label>Arredondar Bordas do QR: {qrRadius}%</label>
              <input type="range" min="0" max="50" value={qrRadius} onChange={(e) => setQrRadius(Number(e.target.value))} />
            </div>

            <div className="slider-row" style={{ marginTop: '10px' }}>
              <label>Qualidade do Download: {size}px</label>
              <input type="range" min="128" max="1024" step="32" value={size} onChange={(e) => setSize(Number(e.target.value))} />
            </div>
          </div>

          <div className="control-card">
            <h3>🖼️ Personalizar Logo</h3>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="file-input" />
            
            {rawLogo && (
              <div className="advanced-sliders">
                <div className="slider-row">
                  <label>Largura da Logo: {logoWidth}px</label>
                  <input type="range" min="10" max={maxLogoDim} value={logoWidth} onChange={(e) => setLogoWidth(Number(e.target.value))} />
                </div>
                
                <div className="slider-row">
                  <label>Altura da Logo: {logoHeight}px</label>
                  <input type="range" min="10" max={maxLogoDim} value={logoHeight} onChange={(e) => setLogoHeight(Number(e.target.value))} />
                </div>

                <div className="slider-row">
                  <label>Arredondar Logo: {logoRadius}%</label>
                  <input type="range" min="0" max="100" value={logoRadius} onChange={(e) => setLogoRadius(Number(e.target.value))} />
                </div>

                <div className="slider-row">
                  <label>Espaço em Branco (Padding): {logoPadding}px</label>
                  <input type="range" min="0" max="25" value={logoPadding} onChange={(e) => setLogoPadding(Number(e.target.value))} />
                </div>
                
                <div className="checkbox-field">
                  <input 
                    type="checkbox" 
                    checked={recortarFundo} 
                    onChange={(e) => setRecortarFundo(e.target.checked)} 
                    id="excavate" 
                  />
                  <label htmlFor="excavate">Remover módulos atrás da logo</label>
                </div>
              </div>
            )}
          </div>

          {mostrarQR && (
            <button onClick={baixarQRCode} className="download-btn">
              Baixar PNG
            </button>
          )}
        </aside>

        <main className="preview">
          <div className="qr-container-card">
            {mostrarQR ? (
              <div ref={qrRef} className="canvas-wrapper" style={{ background: 'transparent', padding: 0, boxShadow: 'none' }}>
                
                <div 
                  style={{ 
                    backgroundColor: bgColor, 
                    padding: `${qrMargin}px`, 
                    borderRadius: `${qrRadius}%`,
                    display: 'inline-block',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                  }}
                >
                  <QRCodeCanvas
                    value={input || "Gerador de QR Code"}
                    size={size}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level="H" 
                    includeMargin={false} 
                    imageSettings={processedLogo ? {
                      src: processedLogo,
                      height: logoHeight,
                      width: logoWidth,
                      excavate: recortarFundo,
                    } : undefined}
                    style={{ width: "100%", height: "auto", maxWidth: "300px", display: "block" }}
                  />
                </div>

              </div>
            ) : (
              <div className="empty-preview">
                <p>Aguardando link para gerar o QR...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="footer">
        <span>By <strong>MarcoALR</strong></span>
      </footer>
    </div>
  );
}