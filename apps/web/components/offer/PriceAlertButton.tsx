
"use client"
import { useState } from "react"
import { Bell } from "lucide-react"

export function PriceAlertButton({ offerId, currentPrice }: { offerId: number, currentPrice: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [targetPrice, setTargetPrice] = useState(currentPrice > 0 ? (currentPrice * 0.9).toFixed(2) : "")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch(`/api/offers/${offerId}/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, targetPrice })
      })
      if (res.ok) {
        setStatus("success")
        setTimeout(() => setIsOpen(false), 2000)
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
          padding: "0.8rem",
          borderRadius: "var(--radius)",
          background: "var(--muted)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          fontWeight: 600,
          cursor: "pointer",
          marginTop: "0.5rem",
          transition: "background 0.2s"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "var(--border)"}
        onMouseOut={(e) => e.currentTarget.style.background = "var(--muted)"}
      >
        <Bell size={18} />
        Criar Alerta de Preço
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "1rem"
        }}>
          <div style={{
            background: "var(--background)",
            padding: "1.5rem",
            borderRadius: "var(--radius)",
            width: "100%",
            maxWidth: "400px",
            border: "1px solid var(--border)",
            position: "relative"
          }}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted-foreground)"
              }}
            >
              ✕
            </button>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: 700 }}>
              🔔 Alerta de Preço
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
              Avisa-me por e-mail se o preço deste produto baixar!
            </p>

            {status === "success" ? (
              <div style={{ color: "#16a34a", fontWeight: 600, textAlign: "center", padding: "1rem" }}>
                Alerta criado com sucesso!
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", fontWeight: 600 }}>
                    Preço Desejado (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--foreground)"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", fontWeight: 600 }}>
                    O teu e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teu.email@exemplo.com"
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--foreground)"
                    }}
                  />
                </div>
                {status === "error" && (
                  <div style={{ color: "#dc2626", fontSize: "0.85rem" }}>
                    Ocorreu um erro ao criar o alerta. Tenta novamente.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "var(--radius)",
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    border: "none",
                    fontWeight: 700,
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    opacity: status === "loading" ? 0.7 : 1
                  }}
                >
                  {status === "loading" ? "A guardar..." : "Guardar Alerta"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

