import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.join("db", "contacts.json");

export async function listContacts() {
  const contacts = await fs.readFile(contactsPath);

  return JSON.parse(contacts);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contactById = contacts.find((contact) => contact.id === contactId);

  return contactById || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === contactId);
  if (idx === -1) {
    return null;
  }

  const [removedContact] = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return removedContact;
}

export async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}

export async function updateContactById(id, data) {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === id);
  if (idx === -1) {
    return null;
  }

  const updatedContact = { ...contacts[idx], ...data };
  contacts[idx] = updatedContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return updatedContact;
}
