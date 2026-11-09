// ==========================================================================
// DP | FILMS — Default Email Templates for Trigger Email Extension
// Collection in Firestore: "mailTemplates"
// Extension target: Trigger Email from Firestore (firebase/firestore-send-email)
// ==========================================================================

export const defaultMailTemplates = [
  // 1. General Reception Confirmation
  {
    id: "received",
    name: "Application Received (Confirmation)",
    category: "General",
    subject: "Application received: {{name}} — DP | FILMS",
    text: `Hi {{name}},

Thank you for reaching out regarding DP | FILMS and submitting your application as {{role}} ({{country}}).

I have received your materials and will personally review your pitch within 48 hours. 

If your vision aligns with the upcoming short film, I will contact you directly to schedule our first discussion.

Warm regards,
Dominik Šuškevič
Filmmaker & Photographer
DP | FILMS — SPACE. LIGHT. EMOTION.
https://films.dominikphotofficial.lt
info@dominikphotofficial.lt`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0d1e1e; background: #ffffff; border: 1px solid #d1dedc; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS</span>
    <h2 style="margin: 6px 0 0; color: #113939; font-size: 20px;">Thank you for your application, {{name}}</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    I have safely received your application as <strong>{{role}}</strong> from <strong>{{country}}</strong> for <strong>{{proposalType}}</strong>.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    I personally review every script, pitch, and portfolio within 48 hours. If your vision and creative sensibilities align with our upcoming short film production, I will reach back out to arrange our introductory talk.
  </p>
  <div style="margin: 24px 0; padding: 14px 18px; background: #f4f7f6; border-left: 3px solid #113939; border-radius: 4px; font-size: 13px; color: #5e7673;">
    <strong>Next Step:</strong> You will hear back directly via your provided contact channel.
  </div>
  <p style="font-size: 14px; line-height: 1.6; color: #2f4442; margin-top: 24px;">
    Best regards,<br>
    <strong>Dominik Šuškevič</strong><br>
    <span style="color: #5e7673; font-size: 12px;">Director & Cinematographer &middot; DP | FILMS</span><br>
    <a href="https://films.dominikphotofficial.lt" style="color: #113939; text-decoration: underline; font-size: 13px;">films.dominikphotofficial.lt</a>
  </p>
</div>`
  },

  // 2. In Talks (Let's chat)
  {
    id: "in_talks",
    name: "Let's Chat / Introductory Call",
    category: "General",
    subject: "Let's discuss our short film collaboration: {{name}} — DP | FILMS",
    text: `Hi {{name}},

I reviewed your submission for {{role}} and was genuinely impressed by your background and approach.

I would love to set up a short informal video call or chat to get to know each other, discuss our creative vision, and talk through the script and schedule.

Are you available in the coming days for a 20-minute chat? Let me know your current timezone and when works best for you.

Best regards,
Dominik Šuškevič
DP | FILMS
info@dominikphotofficial.lt`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0d1e1e; background: #ffffff; border: 1px solid #d1dedc; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS</span>
    <h2 style="margin: 6px 0 0; color: #113939; font-size: 20px;">Let's connect, {{name}}</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    I reviewed your background as <strong>{{role}}</strong> and would love to move forward with an introductory discussion.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    I'd like to set up a short 20-minute informal video call or message chat to talk about our upcoming short film concept, creative direction, and logistics.
  </p>
  <div style="margin: 20px 0; padding: 14px 18px; background: #f4f7f6; border-left: 3px solid #113939; border-radius: 4px; font-size: 14px; color: #113939;">
    <strong>Please reply with:</strong> your preferred days, times, and your current time zone.
  </div>
  <p style="font-size: 14px; line-height: 1.6; color: #2f4442;">
    Looking forward to speaking with you,<br>
    <strong>Dominik Šuškevič</strong><br>
    <span style="color: #5e7673; font-size: 12px;">Director &middot; DP | FILMS</span>
  </p>
</div>`
  },

  // 3. Need More Information
  {
    id: "need_more_info",
    name: "Need More Information / Portfolio",
    category: "General",
    subject: "A quick question regarding your submission: {{name}} — DP | FILMS",
    text: `Hi {{name}},

Thank you for your application as {{role}}. 

To help me better assess how your profile fits into the short film production, could you please share a few additional details or links to previous works (showreel, script sample, or past projects)?

Looking forward to hearing from you.

Best,
Dominik Šuškevič
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0d1e1e; background: #ffffff; border: 1px solid #d1dedc; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS</span>
    <h2 style="margin: 6px 0 0; color: #113939; font-size: 20px;">Question regarding your submission</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    Hi {{name}}, thank you for applying as <strong>{{role}}</strong>.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    Could you please share a few additional links or examples of your recent work (showreel, previous scripts, or voice samples)? This will help us evaluate the project chemistry before scheduling our chat.
  </p>
  <p style="font-size: 14px; color: #2f4442;">
    Best regards,<br>
    <strong>Dominik Šuškevič</strong>
  </p>
</div>`
  },

  // 4. Accepted (Welcome to the Team)
  {
    id: "accepted",
    name: "Welcome to the Film Team (Accepted)",
    category: "General",
    subject: "Welcome to the Team: {{name}} — DP | FILMS",
    text: `Hi {{name}},

I am thrilled to officially welcome you to the DP | FILMS short film team as {{role}}!

As agreed, you will receive guaranteed prominent screen credit in the film's opening and closing titles, full accreditation at all festival screenings, and direct collaborative access to production assets.

I am sending over our collaboration deal memo and project timeline shortly. Let's make an extraordinary film together.

Warm regards,
Dominik Šuškevič
Director & Cinematographer
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0d1e1e; background: #ffffff; border: 1px solid #d1dedc; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS &middot; Official Invitation</span>
    <h2 style="margin: 6px 0 0; color: #113939; font-size: 20px;">Welcome to the Team, {{name}}!</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    I am excited to officially invite you to join our short film production as <strong>{{role}}</strong>.
  </p>
  <div style="background: #f4f7f6; border-left: 3px solid #113939; padding: 16px; border-radius: 4px; margin: 20px 0; font-size: 14px;">
    <strong>Guaranteed Collaboration Terms:</strong>
    <ul style="margin: 8px 0 0 18px; padding: 0; color: #2f4442; line-height: 1.6;">
      <li>Official screen title credits in opening & closing sequences</li>
      <li>Full festival attribution & IMDb/catalog inclusion</li>
      <li>Signed Collaboration Agreement / Deal Memo</li>
      <li>Shared high-resolution copies for your personal showreel</li>
    </ul>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    I will send across the deal memo and production schedule so we can begin immediately.
  </p>
  <p style="font-size: 14px; line-height: 1.6; color: #2f4442; margin-top: 24px;">
    Warm regards,<br>
    <strong>Dominik Šuškevič</strong><br>
    <span style="color: #5e7673; font-size: 12px;">Director & Cinematographer</span>
  </p>
</div>`
  },

  // 5. Rejected (Polite & Encouraging)
  {
    id: "rejected",
    name: "Polite & Encouraging Decline",
    category: "General",
    subject: "Update on your DP | FILMS submission: {{name}}",
    text: `Hi {{name}},

Thank you so much for taking the time to share your application for {{role}} and for your interest in DP | FILMS.

After careful consideration of the specific creative direction and character profiles for this particular short film, I won't be able to move forward with this project at this time.

Film curation is subjective and heavily dependent on specific narrative needs. I really appreciate your creative passion, and with your permission, I would love to keep your details on file for future productions.

I wish you every success with your creative endeavors.

Best regards,
Dominik Šuškevič
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0d1e1e; background: #ffffff; border: 1px solid #d1dedc; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS</span>
    <h2 style="margin: 6px 0 0; color: #113939; font-size: 20px;">Thank you for your submission, {{name}}</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    Thank you very much for submitting your application for <strong>{{role}}</strong>.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    Due to the specific stylistic constraints and character dynamics of our current short film slate, I am unable to offer a role on this particular production.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    Please keep creating and pursuing your craft. With your permission, I would be glad to keep your contact info on file as future projects take shape.
  </p>
  <p style="font-size: 14px; color: #2f4442; margin-top: 24px;">
    Best regards,<br>
    <strong>Dominik Šuškevič</strong>
  </p>
</div>`
  },

  // 6. Category Variant: Film Idea
  {
    id: "variant_film_idea",
    name: "Film Idea / Treatment Feedback",
    category: "Film Idea",
    subject: "Thoughts on your film idea: {{name}} — DP | FILMS",
    text: `Hi {{name}},

Thank you for pitching your short film concept to DP | FILMS.

I read through your treatment with great curiosity. Your visual imagery and core conflict have intriguing potential.

I'd like to ask a couple of quick questions to see how this could translate into our upcoming production schedule and camera setups:
1. What is the approximate target runtime (e.g. 5-10 minutes)?
2. What are the key locations envisioned?

Looking forward to developing this dialogue.

Warmly,
Dominik Šuškevič
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0d1e1e; background: #ffffff; border: 1px solid #d1dedc; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS &middot; Film Concept</span>
    <h2 style="margin: 6px 0 0; color: #113939; font-size: 20px;">Feedback on your film concept, {{name}}</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    Thank you for sharing your story concept with me. The visual atmosphere and premise show strong cinematic promise.
  </p>
  <div style="background: #f4f7f6; border-left: 3px solid #113939; padding: 14px 18px; border-radius: 4px; margin: 18px 0; font-size: 14px; color: #2f4442;">
    To help me gauge production feasibility:
    <ol style="margin: 6px 0 0 18px; padding: 0; line-height: 1.6;">
      <li>What is your envisioned runtime (minutes)?</li>
      <li>Are the required locations primarily interior or natural exterior?</li>
    </ol>
  </div>
  <p style="font-size: 14px; color: #2f4442;">
    Best regards,<br>
    <strong>Dominik Šuškevič</strong>
  </p>
</div>`
  },

  // 7. Category Variant: Screenplay
  {
    id: "variant_screenplay",
    name: "Screenplay / Script Review",
    category: "Screenplay",
    subject: "Screenplay review: {{name}} — DP | FILMS",
    text: `Hi {{name}},

I received your screenplay and materials. Thank you for trusting me with your written story.

I am dedicating time to read your pages closely with a focus on visual storytelling, character arcs, and cinematic feasibility. I will share detailed thoughts shortly.

Best regards,
Dominik Šuškevič
Director & Cinematographer
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0d1e1e; background: #ffffff; border: 1px solid #d1dedc; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS &middot; Script Coverage</span>
    <h2 style="margin: 6px 0 0; color: #113939; font-size: 20px;">Screenplay Review in Progress, {{name}}</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    Thank you for submitting your screenplay to DP | FILMS. Your creative copyright and ownership are strictly protected.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    I am currently reviewing the script with focus on dialogue authenticity, visual rhythm, and cinematography options. I will follow up with you as soon as I finish reading.
  </p>
  <p style="font-size: 14px; color: #2f4442;">
    Best regards,<br>
    <strong>Dominik Šuškevič</strong><br>
    <span style="color: #5e7673; font-size: 12px;">Director & Cinematographer</span>
  </p>
</div>`
  },

  // 8. Category Variant: Commercial / Videography Collaboration
  {
    id: "variant_commercial",
    name: "Commercial & Videography Inquiry",
    category: "Commercial/Videography Collaboration",
    subject: "Videography & Production Collaboration: {{name}} — DP | FILMS",
    text: `Hi {{name}},

Thank you for reaching out regarding a videography and production collaboration.

As a certified videographer and editor, I welcome discussions around commercial projects, music videos, and cinematography commissions that celebrate clean aesthetic framing, natural light, and authentic emotion.

Let's discuss your timeline, project scope, and creative expectations. When would be a good time for a call?

Best regards,
Dominik Šuškevič
DP | FILMS
info@dominikphotofficial.lt`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0d1e1e; background: #ffffff; border: 1px solid #d1dedc; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS &middot; Videography</span>
    <h2 style="margin: 6px 0 0; color: #113939; font-size: 20px;">Videography Collaboration, {{name}}</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    Thank you for your inquiry regarding cinematography and videography collaboration.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    I would love to learn more about your project goals, desired visual tone, and upcoming dates. Let's arrange a call to discuss the creative brief.
  </p>
  <p style="font-size: 14px; color: #2f4442;">
    Warm regards,<br>
    <strong>Dominik Šuškevič</strong><br>
    <span style="color: #5e7673; font-size: 12px;">Certified Videographer & Editor</span>
  </p>
</div>`
  },

  // 9. Category Variant: Other Creative Inquiry
  {
    id: "variant_other",
    name: "Other Creative Inquiry Response",
    category: "Other",
    subject: "Regarding your inquiry: {{name}} — DP | FILMS",
    text: `Hi {{name}},

Thank you for reaching out to DP | FILMS.

I have received your message regarding {{proposalType}} and will review your note carefully. I will get back to you with thoughts shortly.

Best regards,
Dominik Šuškevič
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0d1e1e; background: #ffffff; border: 1px solid #d1dedc; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS</span>
    <h2 style="margin: 6px 0 0; color: #113939; font-size: 20px;">Creative Inquiry Received</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    Hi {{name}}, thank you for reaching out regarding <strong>{{proposalType}}</strong>.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #2f4442;">
    I will review your message and reply as soon as possible.
  </p>
  <p style="font-size: 14px; color: #2f4442;">
    Best regards,<br>
    <strong>Dominik Šuškevič</strong>
  </p>
</div>`
  }
];

export function renderHandlebars(str, data) {
  if (!str) return '';
  return str.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    return data[key] !== undefined && data[key] !== null ? String(data[key]) : '';
  });
}
