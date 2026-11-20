import { useState } from "react";
import "./App.css";

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [editId, setEditId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");

  // Get input values
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Add or update contact
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editId !== null) {
      const updated = contacts.map((contact) => {
        if (contact.id === editId) {
          return { ...contact, ...form };
        }
        return contact;
      });

      setContacts(updated);
      setEditId(null);
    } else {
      const newContact = {
        id: Date.now(),
        ...form,
      };

      setContacts([...contacts, newContact]);
    }

    setForm({
      name: "",
      phone: "",
      email: "",
    });
  }

  function handleEdit(contact: Contact) {
    setForm({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    });

    setEditId(contact.id);
  }

  // Delete contact
  function handleDelete(id: number) {
    const updated = contacts.filter((contact) => contact.id !== id);
    setContacts(updated);
  }

  // Search contacts
  const filteredContacts = contacts.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone.includes(search)
    );
  });

  // Sort contacts by name
  const sortedContacts = [...filteredContacts];

  sortedContacts.sort((a, b) => {
    if (sortOrder === "A-Z") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <div className="container py-5">
      <h2 className="text-center">Contact Directory</h2>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="card form-card p-4 mb-4">
        <h5>{editId !== null ? "Update Contact" : "Add New Contact"}</h5>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          className="form-control mb-3"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Enter Phone"
          className="form-control mb-3"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          className="form-control mb-3"
          value={form.email}
          onChange={handleChange}
          required
        />

        <button className="btn btn-dark">
          {editId !== null ? "Update Contact" : "Add Contact"}
        </button>
      </form>

      {/* Search and Sort */}
      <div className="card filter-card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="A-Z">Name (A-Z)</option>
              <option value="Z-A">Name (Z-A)</option>
            </select>
          </div>
        </div>

        <p className="count mt-3 mb-0">
          Total Contacts: <strong>{contacts.length}</strong>
        </p>
      </div>

      {/* Display Contacts */}
      <div className="row g-3">
        {sortedContacts.map((contact) => (
          <div className="col-md-4" key={contact.id}>
            <div className="card contact-card p-3 h-100">
              <h5>{contact.name}</h5>

              <p>Phone: {contact.phone}</p>
              <p>Email: {contact.email}</p>

              <div className="d-flex gap-2 mt-auto">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEdit(contact)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(contact.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Messages */}
      {contacts.length === 0 && <p className="message">No Contacts Found!</p>}

      {contacts.length > 0 && sortedContacts.length === 0 && (
        <p className="message">No matching contacts found!</p>
      )}
    </div>
  );
}

export default App;
