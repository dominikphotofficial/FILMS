// ==========================================================================
// DP | FILMS — Default Email Templates Seed Data
// Formatted for Firebase Extension "Trigger Email from Firestore" (mailTemplates)
// Fields: subject, text, html with Handlebars placeholders:
// {{name}}, {{role}}, {{country}}, {{proposalType}}, {{message}}
// ==========================================================================

export const defaultTemplates = [
  // 1. CONFIRMATION / RECEIVED
  {
    id: "received",
    category: "all",
    title: "Application Received (All Categories)",
    subject: "DP | FILMS — Application Received: {{name}} ({{role}})",
    text: `Hi {{name}},

Thank you for reaching out regarding the DP | FILMS short film production. 

I have received your application for the {{role}} role ({{proposalType}}) from {{country}}. I personally review every pitch, script synopsis, and collaborator inquiry. 

I will review your message:
"{{message}}"

I will get back to you within 48 hours to discuss next steps.

Best regards,
Dominik Šuškevič
Filmmaker & Cinematographer
DP | FILMS
info@dominikphotofficial.lt
https://films.dominikphotofficial.lt`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #113939; font-size: 20px; letter-spacing: 0.05em;">DP | FILMS</h2>
    <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">SPACE. LIGHT. EMOTION.</span>
  </div>
  <p style="font-size: 15px; line-height: 1.6;">Hi <strong>{{name}}</strong>,</p>
  <p style="font-size: 15px; line-height: 1.6;">Thank you for reaching out regarding the <strong>DP | FILMS</strong> short film production. I have received your submission for the <strong>{{role}}</strong> position ({{proposalType}}) from {{country}}.</p>
  <p style="font-size: 15px; line-height: 1.6;">I review every pitch, treatment, and portfolio personally. I will get back to you within <strong>48 hours</strong> with feedback or next steps.</p>
  <div style="background-color: #f9fafb; border-left: 3px solid #113939; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
    <div style="font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">Your Submission Summary:</div>
    <div style="font-size: 13.5px; color: #374151; line-height: 1.5; white-space: pre-wrap;">{{message}}</div>
  </div>
  <p style="font-size: 15px; line-height: 1.6;">Best regards,<br><strong>Dominik Šuškevič</strong><br><span style="font-size: 13px; color: #6b7280;">Filmmaker &amp; Cinematographer &middot; DP | FILMS</span><br><a href="mailto:info@dominikphotofficial.lt" style="color: #113939; text-decoration: underline; font-size: 13px;">info@dominikphotofficial.lt</a></p>
</div>`
  },

  // 2. IN TALKS — Film Idea
  {
    id: "in_talks_film_idea",
    category: "Film Idea",
    title: "In Talks — Film Idea Pitch",
    subject: "DP | FILMS — Next steps for your film concept: {{name}}",
    text: `Hi {{name}},

I reviewed your film idea and vision submitted through films.dominikphotofficial.lt. The atmospheric visual direction and concept you proposed resonate strongly with my cinematic style.

I would love to arrange a short introductory conversation (via Telegram, Google Meet, or email) to explore character motives, visual tone, and filming feasibility.

Could you let me know your general timezone and when you might be free for a brief chat this week?

Looking forward to creating together,
Dominik Šuškevič
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #113939; font-size: 20px;">DP | FILMS &middot; Project Discussion</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6;">Hi <strong>{{name}}</strong>,</p>
  <p style="font-size: 15px; line-height: 1.6;">I have reviewed your film idea submitted through our portfolio site. The mood and premise you outlined have genuine visual potential that fits my cinematic focus on stillness, natural light, and tension.</p>
  <p style="font-size: 15px; line-height: 1.6;">I would love to schedule a brief introductory exchange (via Telegram or video call) to discuss how we could develop this into a production-ready short film script.</p>
  <p style="font-size: 15px; line-height: 1.6;">Please let me know your availability over the coming days.</p>
  <p style="font-size: 15px; line-height: 1.6;">Best regards,<br><strong>Dominik Šuškevič</strong><br><span style="font-size: 13px; color: #6b7280;">Director &amp; Cinematographer</span></p>
</div>`
  },

  // 3. IN TALKS — Screenplay
  {
    id: "in_talks_screenplay",
    category: "Screenplay",
    title: "In Talks — Screenplay Discussion",
    subject: "DP | FILMS — Screenplay Review: {{name}}",
    text: `Hi {{name}},

Thank you for sharing your screenplay materials for DP | FILMS. 

Your dramatic structure and dialogue reflect a distinct voice. I am interested in exploring how we could co-produce or direct this short narrative. Let's discuss shooting locations, script revisions, and potential festival distribution.

Please let me know your preferred channel for reading notes and script discussion.

Best regards,
Dominik Šuškevič
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #113939; font-size: 20px;">DP | FILMS &middot; Screenplay Review</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6;">Hi <strong>{{name}}</strong>,</p>
  <p style="font-size: 15px; line-height: 1.6;">Thank you for submitting your screenplay to DP | FILMS. The rhythm, characters, and visual storytelling are compelling and align with the kind of cinematic drama I aim to direct.</p>
  <p style="font-size: 15px; line-height: 1.6;">I'd like to share my directorial notes with you and discuss production logistics, visual references, and timeline.</p>
  <p style="font-size: 15px; line-height: 1.6;">Warm regards,<br><strong>Dominik Šuškevič</strong><br><span style="font-size: 13px; color: #6b7280;">DP | FILMS</span></p>
</div>`
  },

  // 4. NEED MORE INFO — General / Actor / Sound
  {
    id: "need_more_info",
    category: "all",
    title: "Need More Info / Showreel Request",
    subject: "DP | FILMS — Additional details requested: {{role}} application",
    text: `Hi {{name}},

Thank you for applying to join the short film team as {{role}}. 

To help me evaluate how your style fits the upcoming film, could you please send:
1. Links to your recent showreel, previous film work, or audio/writing samples.
2. Your current location / base city (in {{country}}).
3. Your expected availability over the next 2-3 months.

You can reply directly to this email or send links via Telegram.

Best regards,
Dominik Šuškevič
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #113939; font-size: 20px;">DP | FILMS &middot; Collaborator Inquiry</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6;">Hi <strong>{{name}}</strong>,</p>
  <p style="font-size: 15px; line-height: 1.6;">Thank you for your interest in joining our film team as <strong>{{role}}</strong>.</p>
  <p style="font-size: 15px; line-height: 1.6;">To help me prepare the production schedule and confirm creative alignment, could you please provide a few additional details:</p>
  <ul style="font-size: 14px; line-height: 1.7; color: #374151;">
    <li>Links to your showreel, recent portfolio clips, or samples.</li>
    <li>Your current city / base in {{country}}.</li>
    <li>Your upcoming availability for remote or on-location collaboration.</li>
  </ul>
  <p style="font-size: 15px; line-height: 1.6;">Simply reply directly to this email with your materials.</p>
  <p style="font-size: 15px; line-height: 1.6;">Best regards,<br><strong>Dominik Šuškevič</strong></p>
</div>`
  },

  // 5. ACCEPTED — Welcome to the Team
  {
    id: "accepted",
    category: "all",
    title: "Accepted — Welcome to the Film Team",
    subject: "Welcome to the DP | FILMS Team: {{name}} ({{role}})",
    text: `Hi {{name}},

I am thrilled to officially confirm your role as {{role}} on the upcoming DP | FILMS short film production!

What happens next:
1. Guaranteed Screen Credit: You will receive official prominent screen credit in opening and closing titles: "{{name}} — {{role}}".
2. Deal Memo / Agreement: I am preparing our official collaboration agreement outlining project scope, festival distribution, and mutual commitments.
3. Production Roadmap: I will send over our moodboard, script draft, and shared folder access shortly.

Welcome aboard, and let's create a remarkable cinematic film together!

Best regards,
Dominik Šuškevič
Director & Cinematographer
DP | FILMS
info@dominikphotofficial.lt`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
  <div style="background-color: #113939; color: #ffffff; padding: 18px 24px; border-radius: 6px; margin-bottom: 24px;">
    <span style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.85;">Official Confirmation</span>
    <h2 style="margin: 4px 0 0 0; font-size: 22px; color: #ffffff;">Welcome to the Film Team, {{name}}!</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6;">Hi <strong>{{name}}</strong>,</p>
  <p style="font-size: 15px; line-height: 1.6;">I am excited to officially confirm your participation as <strong>{{role}}</strong> on our upcoming international short film project.</p>
  <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 20px 0;">
    <h4 style="margin: 0 0 8px 0; color: #166534; font-size: 14px;">Next Steps &amp; Guaranteed Credits:</h4>
    <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #15803d; line-height: 1.6;">
      <li><strong>Screen Credit:</strong> You will be prominently credited in both main opening and festival ending titles.</li>
      <li><strong>Collaboration Memo:</strong> An official deal memo is prepared for your signature.</li>
      <li><strong>Production Files:</strong> Shared folder access with treatments, shot lists, and moodboards is incoming.</li>
    </ul>
  </div>
  <p style="font-size: 15px; line-height: 1.6;">I look forward to our first production briefing.</p>
  <p style="font-size: 15px; line-height: 1.6;">Warm regards,<br><strong>Dominik Šuškevič</strong><br><span style="font-size: 13px; color: #6b7280;">DP | FILMS</span></p>
</div>`
  },

  // 6. REJECTED — Polite & Encouraging
  {
    id: "rejected",
    category: "all",
    title: "Polite & Encouraging Decline",
    subject: "DP | FILMS — Regarding your application: {{name}}",
    text: `Hi {{name}},

Thank you very much for your interest in DP | FILMS and for sharing your submission as {{role}}.

After careful review of our current production schedule and stylistic direction for this specific short film, I have decided to move forward with a different project scope. 

This is solely a question of stylistic alignment with this particular shoot, and does not diminish the merit of your creative portfolio. With your permission, I would like to keep your contact info on file for future productions where your skills could be an ideal match.

I wish you every success in your filmmaking and creative projects.

Warm regards,
Dominik Šuškevič
DP | FILMS`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
  <div style="border-bottom: 2px solid #113939; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #113939; font-size: 20px;">DP | FILMS &middot; Project Update</h2>
  </div>
  <p style="font-size: 15px; line-height: 1.6;">Hi <strong>{{name}}</strong>,</p>
  <p style="font-size: 15px; line-height: 1.6;">Thank you very much for your interest in collaborating with DP | FILMS and for taking the time to share your application for <strong>{{role}}</strong>.</p>
  <p style="font-size: 15px; line-height: 1.6;">For this specific short film, I have decided to proceed with a slightly different narrative and stylistic focus that matches our immediate festival constraints.</p>
  <p style="font-size: 15px; line-height: 1.6;">I will retain your portfolio details on file for future opportunities where your distinct artistic style would be a great fit.</p>
  <p style="font-size: 15px; line-height: 1.6;">I wish you great creative momentum in your ongoing filmmaking pursuits.</p>
  <p style="font-size: 15px; line-height: 1.6;">Best regards,<br><strong>Dominik Šuškevič</strong><br><span style="font-size: 13px; color: #6b7280;">DP | FILMS</span></p>
</div>`
  }
];
