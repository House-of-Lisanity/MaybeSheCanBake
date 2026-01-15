// src/app/admin-test/page.tsx
"use client";

import { useState } from "react";

export default function AdminTestPage() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSeedFlashSale = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/seed-flash-sale", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlashSale = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/seed-flash-sale", {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Admin Test Page</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Temporary page for testing flash sale seeding. Remove this page before production.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button
          onClick={handleSeedFlashSale}
          disabled={loading}
          style={{
            padding: "1rem",
            fontSize: "1rem",
            background: "#3a9188",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Processing..." : "Create/Update Valentine's Flash Sale"}
        </button>

        <button
          onClick={handleDeleteFlashSale}
          disabled={loading}
          style={{
            padding: "1rem",
            fontSize: "1rem",
            background: "#d9534f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Processing..." : "Delete Valentine's Flash Sale"}
        </button>
      </div>

      {message && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: message.startsWith("✅") ? "#d4edda" : "#f8d7da",
            border: `1px solid ${message.startsWith("✅") ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "8px",
            color: message.startsWith("✅") ? "#155724" : "#721c24",
          }}
        >
          {message}
        </div>
      )}

      <div style={{ marginTop: "2rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0 }}>Instructions:</h3>
        <ol style={{ lineHeight: 1.8 }}>
          <li>Click &ldquo;Create/Update Valentine&apos;s Flash Sale&rdquo; to add the flash sale to your database</li>
          <li>Go to the home page to see the banner appear below the hero section</li>
          <li>Click &quot;Order Now&quot; on the banner to test the modal and order form</li>
          <li>Submit a test order and check your email for confirmations</li>
          <li>Use &quot;Delete&quot; button to remove the flash sale when testing is complete</li>
        </ol>
      </div>
    </div>
  );
}
