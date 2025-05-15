import { useState } from "react";
import type { CreateBook } from "../types";

export default function BookForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitData();
  }
  async function submitData() {
    const body = JSON.stringify(formData);
    console.log(body);
    const req = await fetch("http://localhost:3000/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const res = await req.json();
    if (res.statusCode !== 201) {
      setErrortext(res.message);
      return;
    }
    setErrortext("");
    setFormData({ author: "", page_count: 0, publish_year: 0, title: "" });
    window.location.reload();
  }
  const [errortext, setErrortext] = useState<string>("");
  const [formData, setFormData] = useState<CreateBook>({
    title: "",
    author: "",
    publish_year: 0,
    page_count: 0,
  });
  return (
    <form
      id="newBook"
      onSubmit={handleSubmit}
      className="flex border border-black m-3 rounded-xl flex-col gap-4"
    >
      {errortext && errortext.length > 0 && (
        <span className="w-full bg-red-200 rounded-t-xl p-3">
          <h2 className="text-lg">Hiba!</h2>
          <p>{errortext}</p>
        </span>
      )}
      <input
        onChange={(e) =>
          setFormData({ ...formData, title: e.currentTarget.value })
        }
        type="text"
        name="title"
        placeholder="Könyv címe"
      />

      <label htmlFor="author">Szerző</label>
      <input
        onChange={(e) =>
          setFormData({ ...formData, author: e.currentTarget.value })
        }
        type="text"
        name="author"
        placeholder="Könyv szerzője"
      />

      <label htmlFor="year">Kiadás éve</label>
      <input
        value={formData.publish_year}
        onChange={(e) =>
          setFormData({ ...formData, publish_year: +e.currentTarget.value })
        }
        type="number"
        name="year"
        placeholder="Kiadási év"
      />

      <label htmlFor="page">Oldalszám</label>
      <input
        value={formData.page_count}
        onChange={(e) =>
          setFormData({ ...formData, page_count: +e.currentTarget.value })
        }
        type="number"
        name="page"
        placeholder="Oldalszám"
      />

      <button type="submit" className="bg-green-300 rounded-xl p-3">
        Új könyv
      </button>
    </form>
  );
}
