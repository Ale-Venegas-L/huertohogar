import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

const Contacto = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(formData.entries());
      
      const contactData = {
        ...formValues,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'contactos'), contactData);
      
      console.log('Document written with ID: ', docRef.id);
      setSubmitStatus({ 
        success: true, 
        message: '¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.' 
      });
      
      e.target.reset();
    } catch (error) {
      console.error('Error adding document: ', error);
      setSubmitStatus({ 
        success: false, 
        message: 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
    <div className="contact">
      <h1>Contacto</h1>
      <p>Puedes escribirnos para más información.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Nombre
        </label>
        <input type="text" id="name" name="name" />
        <label htmlFor="email">
          Email
        </label>
        <input type="email" id="email" name="email" />
        <label htmlFor="message">
          Mensaje
        </label>
        <textarea id="message" name="message"></textarea>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
        {submitStatus.message && (
          <div className={`message ${submitStatus.success ? 'success' : 'error'}`}>
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
    </main>
  )
};

export default Contacto;
