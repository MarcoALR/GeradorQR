import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [mostrarQR, setMostrarQR] = useState(false);
  const qrRef = useRef(null);

  const gerarQRCode = () => {
    if (input.trim() === "") {
      alert("Digite uma URL ou texto.");
      return;
    }
    setMostrarQR(true);
  };

  const baixarQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <div className="container">
      <br />
      <br />
      <br />
      <br />
      <h1>Gerador de QR Code</h1>
      <p>
        Cole um link, texto ou qualquer informação abaixo e gere seu QR Code.
      </p>

      <input
        type="text"
        placeholder="Ex: https://meusite.com"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="buttons">
        <button onClick={gerarQRCode}>Gerar</button>
        {mostrarQR && <button onClick={baixarQRCode}>Baixar</button>}
      </div>

      {mostrarQR && (
        <div ref={qrRef} className="qr-box">
          <QRCodeCanvas
            value={input}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </div>
      )}
    </div>
  );
}
