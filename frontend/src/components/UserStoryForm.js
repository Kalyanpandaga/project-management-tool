import React, { useState } from "react";

const UserStoryForm = () => {
  const [description, setDescription] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder: Replace with actual Groq API call
    setTimeout(() => {
      setStories([
        "As a user, I want to log in so that I can access my dashboard.",
        "As a manager, I want to assign tasks so that my team is productive.",
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI User Story Generator</h1>
      <form onSubmit={handleGenerate} className="mb-4 space-y-2">
        <textarea
          className="border px-2 py-1 rounded w-full"
          placeholder="Describe your project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate User Stories"}
        </button>
      </form>
      <div>
        <h2 className="font-semibold mb-2">Generated User Stories</h2>
        <ul className="list-disc ml-6">
          {stories.map((story, i) => (
            <li key={i}>{story}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserStoryForm;
