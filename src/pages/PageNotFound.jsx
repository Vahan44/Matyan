export default function PageNotFound() {
    return (
      <div style={{
        display: "flex", 
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        background: "linear-gradient(to right, #e0e0e0, #f8f9fa)"
      }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#333" }}>❌ Էջը չի գտնվել</h1>
        <p style={{ color: "#555", fontSize: "1.2rem", marginTop: "10px" }}>
          Էջը, որը փնտրում եք, գոյություն չունի կամ հեռացվել է։
        </p>
        <a 
          href="/" 
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
            textDecoration: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          Վերադառնալ գլխավոր էջ
        </a>
      </div>
    );
  }
  