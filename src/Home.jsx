import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bem-vindo ao site</h1>
      <p>Vá para a página de QR Code abaixo:</p>
      <Link to="/qr">
        <button>Gerar QR Code</button>
      </Link>
    </div>
  );
}
