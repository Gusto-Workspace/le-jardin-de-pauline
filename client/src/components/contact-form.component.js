import { useContext, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { GlobalContext } from "@/contexts/global.context";

export default function ContactForm() {
  const { restaurantContext } = useContext(GlobalContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { fullName: "", email: "", phone: "", subject: "", message: "", consent: false },
  });

  async function onSubmit(data) {
    setSubmitError("");
    try {
      const response = await fetch("/api/contact-form-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          restaurantName: restaurantContext?.restaurantData?.name || "Le Jardin de Pauline",
          restaurantEmail: restaurantContext?.restaurantData?.email || "",
        }),
      });
      if (!response.ok) throw new Error("contact-form");
      setIsSubmitted(true);
      reset();
    } catch {
      setSubmitError("Une erreur est survenue. Réessayez ou contactez-nous directement par téléphone.");
    }
  }

  if (isSubmitted) {
    return <div className="garden-contact-success" role="status"><Check size={34} strokeWidth={1.3} /><p className="eyebrow">Merci pour votre message</p><h3>À très bientôt au jardin.</h3><p>Nous revenons vers vous dès que possible.</p><button type="button" className="btn outline" onClick={() => setIsSubmitted(false)}>Écrire un autre message</button></div>;
  }

  return <form className="garden-contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
    {submitError ? <p className="garden-form-error" role="alert">{submitError}</p> : null}
    <div className="garden-contact-form__grid">
      <Field label="Nom & prénom" error={errors.fullName?.message}><input autoComplete="name" {...register("fullName", { required: "Indiquez votre nom." })} /></Field>
      <Field label="E-mail" error={errors.email?.message}><input type="email" autoComplete="email" {...register("email", { required: "Indiquez votre e-mail.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Adresse e-mail invalide." } })} /></Field>
      <Field label="Téléphone (facultatif)"><input type="tel" autoComplete="tel" {...register("phone")} /></Field>
      <Field label="Objet" error={errors.subject?.message}><select defaultValue="" {...register("subject", { required: "Choisissez un objet." })}><option value="" disabled>Sélectionnez</option><option>Réservation de groupe</option><option>Privatisation</option><option>Événement</option><option>Question générale</option><option>Autre</option></select></Field>
    </div>
    <Field label="Votre message" error={errors.message?.message}><textarea rows="6" {...register("message", { required: "Écrivez votre message.", minLength: { value: 10, message: "Votre message doit contenir au moins 10 caractères." } })} /></Field>
    <label className="garden-contact-consent"><input type="checkbox" {...register("consent", { required: "Votre accord est nécessaire." })} /><span>J’accepte que mes informations soient utilisées pour répondre à ma demande.</span></label>
    {errors.consent ? <p className="garden-form-error">{errors.consent.message}</p> : null}
    <button type="submit" disabled={isSubmitting} className="btn garden-contact-submit">{isSubmitting ? <><Loader2 size={17} className="garden-spinner" /> Envoi en cours…</> : <>Envoyer le message <span>↗</span></>}</button>
  </form>;
}

function Field({ label, error, children }) {
  return <label className="garden-contact-field"><span>{label}</span>{children}{error ? <small>{error}</small> : null}</label>;
}
