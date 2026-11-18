import { useEffect, useState } from "react";
import { ShortlistContext } from "./shortlist-context";
import { useAuth } from "./auth-context";
import { supabase } from "../lib/supabase";

function ShortlistProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [result, setResult] = useState({
    userId: null,
    rows: [],
  });

  useEffect(() => {
    if (!userId) return;

    async function load() {
      const { data, error } = await supabase
        .from("saved_careers")
        .select("onet_code, note")
        .order("created_at");
      if (!error) {
        setResult({ userId, rows: data });
      }
    }
    load();
  }, [userId]);

  // Only trust the rows if they belong to the user who is signed in now
  const ready = result.userId === userId;
  const saved = ready ? result.rows : [];

  async function save(code) {
    const { error } = await supabase
      .from("saved_careers")
      .insert({ onet_code: code });
    if (error) return;
    setResult((prev) => ({
      userId,
      rows: [...prev.rows, { onet_code: code, note: "" }],
    }));
  }

  async function remove(code) {
    const { error } = await supabase
      .from("saved_careers")
      .delete()
      .eq("onet_code", code);
    if (error) return;
    setResult((prev) => ({
      userId,
      rows: prev.rows.filter((row) => row.onet_code !== code),
    }));
  }

  async function updateNote(code, note) {
    const { error } = await supabase
      .from("saved_careers")
      .update({ note: note })
      .eq("onet_code", code);
    if (error) return;
    setResult((prev) => ({
      userId,
      rows: prev.rows.map((row) =>
        row.onet_code === code ? { ...row, note } : row,
      ),
    }));
  }

  const value = { saved, ready, save, remove, updateNote };
  return (
    <ShortlistContext.Provider value={value}>
      {children}
    </ShortlistContext.Provider>
  );
}

export default ShortlistProvider;
