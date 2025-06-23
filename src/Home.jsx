import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bem-vindo</h1>
      <p>Ir para o gerador de QR Code:</p>
      <Link to="/qr">
        <button>Ir para QR Code</button>
      </Link>
    </div>
  );
}
