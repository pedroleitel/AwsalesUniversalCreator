// n8n Code node: normalize Nuestra RX forms-site payloads to AWSales form webhook.
// Mode: Run Once for All Items.
//
// HTTP Request node after this code:
// - Method: POST
// - URL: https://awsales-app.prod.awsales.io/api/webhooks/{organization-id}/credentials/{integration-name}
// - Body: {{$json.awsales_payload}}
// - If n8n does not send object bodies correctly, use Raw body with:
//   {{$json.awsales_payload_json}}
//
// Important workflow rule:
// intake_progress/intake_partial are snapshots only and should not trigger AWSales.
// The Worker now emits intake_abandoned after its own 20-minute durable-object
// timeout by session_id; that event is the confirmed form-abandonment trigger.

const CONFIG = {
  formId: 'nuestra_rx_evaluacion_glp1',
  formName: 'Nuestra RX - Evaluacion GLP-1',
  defaultAbandonmentDelayMinutes: 10,
  includeRawPayloadInMetadata: false,
};

const STEP_LABELS = {
  '4': 'Contato e escolha entre WhatsApp ou continuar no site',
  rxMedsList: 'Medicamentos recetados',
  identidad: 'Fecha de nacimiento',
  heightWeight: 'Altura, peso y peso meta',
  bmiConsent: 'Consentimiento BMI/off-label',
  approach: 'Enfoque actual y condiciones medicas',
  recentHistory: 'Historial medico reciente',
  vitals: 'Signos vitales',
  gastricBypass: 'Bypass gastrico reciente',
  currentMeds: 'Medicamentos actuales',
  injectionAbility: 'Capacidad de auto-inyeccion',
  finalConsents: 'Consentimientos finales',
  processing: 'Procesando evaluacion',
  success: 'Evaluacion completada / seleccion de plan',
};

const VALUE_LABELS = {
  m: 'Hombre',
  male: 'Hombre',
  hombre: 'Hombre',
  f: 'Mujer',
  female: 'Mujer',
  mujer: 'Mujer',
  yes: 'Si',
  si: 'Si',
  no: 'No',
  none: 'Ninguno',
  accept: 'Acepto',
  reject: 'No acepto',
  monthly: 'Plan mensual',
  quarterly: 'Plan trimestral',
  semaglutida: 'Semaglutida+ Personalizada',
  semaglutide: 'Semaglutida+ Personalizada',
  tirzepatida: 'Tirzepatida+ Personalizada',
  tirzepatide: 'Tirzepatida+ Personalizada',
  elevated: 'Elevada',
  slightly_fast: 'Ligeramente rapida',
};

const INITIAL_PROFILE_QUESTION_IDS = new Set([
  'nrx_sex',
  'nrx_age_range',
  'nrx_height_weight_bmi',
  'nrx_contact_state',
]);

const QUESTION_DEFS = [
  {
    id: 'nrx_sex',
    question: 'Cual es tu sexo biologico?',
    paths: ['raw_answers.intake.sexo', 'demographics.biological_sex', 'raw_answers.beluga.sex'],
    transform: labelValue,
  },
  {
    id: 'nrx_age_range',
    question: 'Cuantos anos tienes?',
    paths: ['raw_answers.intake.edad', 'demographics.age_range'],
  },
  {
    id: 'nrx_height_weight_bmi',
    question: 'Cuanto mides y cuanto pesas?',
    rawKeys: ['intake.cm', 'intake.kg', 'intake.height', 'intake.weightLbs', 'intake.bmi', 'beluga.heightUnit', 'beluga.heightFt', 'beluga.heightIn', 'beluga.heightCm', 'beluga.weightUnit', 'beluga.weightKg', 'beluga.weightLb', 'beluga.bmi'],
    get: (body) => compactJoin([
      formatMeasure('Altura', getFirst(body, ['biometrics.height_display', 'raw_answers.intake.height'])),
      formatMeasure('Altura cm', getFirst(body, ['biometrics.height_cm', 'raw_answers.intake.cm', 'raw_answers.beluga.heightCm'])),
      formatMeasure('Peso kg', getFirst(body, ['biometrics.weight_kg', 'raw_answers.intake.kg', 'raw_answers.beluga.weightKg'])),
      formatMeasure('Peso lbs', getFirst(body, ['biometrics.weight_lbs', 'raw_answers.intake.weightLbs', 'raw_answers.beluga.weightLb'])),
      formatMeasure('BMI', getFirst(body, ['biometrics.bmi', 'raw_answers.intake.bmi', 'raw_answers.beluga.bmi'])),
    ], ' | '),
  },
  {
    id: 'nrx_contact_state',
    question: 'En que estado estas?',
    paths: ['address.state_code', 'raw_answers.intake.stateCode'],
  },
  {
    id: 'nrx_takes_rx_meds',
    question: 'Tomas algun medicamento recetado?',
    rawKeys: ['beluga.takesRxMeds', 'beluga.rxMeds', 'beluga.rxMedsOther'],
    get: (body) => compactJoin([
      formatMeasure('Respuesta', labelValue(get(body, 'raw_answers.beluga.takesRxMeds'))),
      formatMeasure('Medicamentos', labelValue(getFirst(body, ['raw_answers.beluga.rxMeds', 'medical_history.current_medications']))),
      formatMeasure('Otro', get(body, 'raw_answers.beluga.rxMedsOther')),
    ], ' | '),
  },
  {
    id: 'nrx_allergies',
    question: 'Tienes alergias conocidas?',
    rawKeys: ['beluga.hasAllergies', 'beluga.allergiesList', 'beluga.allergiesOther'],
    get: (body) => compactJoin([
      formatMeasure('Respuesta', labelValue(get(body, 'raw_answers.beluga.hasAllergies'))),
      formatMeasure('Alergias', labelValue(getFirst(body, ['raw_answers.beluga.allergiesList', 'medical_history.allergies']))),
      formatMeasure('Otra', get(body, 'raw_answers.beluga.allergiesOther')),
    ], ' | '),
  },
  {
    id: 'nrx_date_of_birth',
    question: 'Cual es tu fecha de nacimiento?',
    rawKeys: ['beluga.dobMonth', 'beluga.dobDay', 'beluga.dobYear'],
    get: (body) => getFirst(body, ['demographics.dob']) || formatDob(get(body, 'raw_answers.beluga.dobMonth'), get(body, 'raw_answers.beluga.dobDay'), get(body, 'raw_answers.beluga.dobYear')),
  },
  {
    id: 'nrx_highest_weight',
    question: 'Cual fue tu peso mas alto?',
    rawKeys: ['beluga.highestWeight', 'beluga.highestWeightUnit'],
    get: (body) => compactJoin([
      get(body, 'raw_answers.beluga.highestWeight'),
      get(body, 'raw_answers.beluga.highestWeightUnit'),
    ], ' '),
  },
  {
    id: 'nrx_goal_weight',
    question: 'A que peso quieres llegar?',
    rawKeys: ['beluga.goalWeight', 'beluga.goalWeightUnit'],
    get: (body) => compactJoin([
      getFirst(body, ['goals.weight_loss_goal', 'raw_answers.beluga.goalWeight']),
      get(body, 'raw_answers.beluga.goalWeightUnit'),
    ], ' '),
  },
  {
    id: 'nrx_bmi_consent',
    question: 'Consentimiento de uso off-label por BMI 25-29',
    paths: ['raw_answers.beluga.bmiConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_weight_management_approach',
    question: 'Como describirias tu enfoque actual sobre el peso?',
    paths: ['raw_answers.beluga.approach'],
    transform: labelValue,
  },
  {
    id: 'nrx_conditions',
    question: 'Marca todas las condiciones actuales o pasadas',
    paths: ['raw_answers.beluga.conditions', 'medical_history.conditions_quick', 'medical_history.conditions_detail'],
    transform: labelValue,
  },
  {
    id: 'nrx_gallstone_consent',
    question: 'Consentimiento por calculos biliares',
    paths: ['raw_answers.beluga.gallstoneConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_cholecystectomy_consent',
    question: 'Consentimiento por vesicula removida',
    paths: ['raw_answers.beluga.cholecystectomyConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_thyroid_consent',
    question: 'Consentimiento por problemas tiroideos',
    paths: ['raw_answers.beluga.thyroidConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_gastric_bypass_recent',
    question: 'Has tenido bypass gastrico en los ultimos 6 meses?',
    paths: ['raw_answers.beluga.gastricBypass', 'medical_history.gastric_bypass_recent'],
    transform: labelValue,
  },
  {
    id: 'nrx_prior_weight_loss_surgery',
    question: 'Has tenido alguna cirugia de perdida de peso previa?',
    paths: ['raw_answers.beluga.priorWLS'],
    transform: labelValue,
  },
  {
    id: 'nrx_opiates_recent',
    question: 'En los ultimos 3 meses, has tomado opioides?',
    paths: ['raw_answers.beluga.opiates'],
    transform: labelValue,
  },
  {
    id: 'nrx_blood_pressure',
    question: 'Presion arterial',
    paths: ['raw_answers.beluga.bp'],
    transform: labelValue,
  },
  {
    id: 'nrx_heart_rate',
    question: 'Frecuencia cardiaca',
    paths: ['raw_answers.beluga.hr'],
    transform: labelValue,
  },
  {
    id: 'nrx_glp1_drug_allergies',
    question: 'Eres alergico a medicamentos GLP-1/GIP?',
    paths: ['raw_answers.beluga.drugAllergies', 'medical_history.drug_allergies_glp1'],
    transform: labelValue,
  },
  {
    id: 'nrx_current_meds_detail',
    question: 'Medicamentos actuales detallados',
    paths: ['raw_answers.beluga.currentMeds', 'medical_history.current_medications'],
    transform: labelValue,
  },
  {
    id: 'nrx_injection_ability',
    question: 'Puedes inyectarte de forma segura o tener ayuda confiable?',
    paths: ['raw_answers.beluga.injectionAbility', 'medical_history.can_self_inject'],
    transform: labelValue,
  },
  {
    id: 'nrx_last_dose_timing',
    question: 'Cuando fue la ultima vez que tomaste medicamento de perdida de peso?',
    paths: ['raw_answers.beluga.lastDoseTiming'],
    transform: labelValue,
  },
  {
    id: 'nrx_dose_decrease_consent',
    question: 'Acepta reiniciar con dosis reducida?',
    paths: ['raw_answers.beluga.doseDecreaseConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_restart_consent',
    question: 'Acepta reiniciar desde dosis inicial?',
    paths: ['raw_answers.beluga.restartConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_last_dose_date',
    question: 'Fecha aproximada de ultimo uso del medicamento',
    paths: ['raw_answers.beluga.lastDoseDate'],
  },
  {
    id: 'nrx_last_dose_match',
    question: 'Medicamento y dosis mas reciente',
    paths: ['raw_answers.beluga.lastDoseMatch'],
    transform: labelValue,
  },
  {
    id: 'nrx_med_form',
    question: 'Medicamento de marca o compuesto?',
    paths: ['raw_answers.beluga.medForm'],
    transform: labelValue,
  },
  {
    id: 'nrx_compound_details',
    question: 'Detalles del medicamento compuesto',
    paths: ['raw_answers.beluga.compoundDetails'],
  },
  {
    id: 'nrx_side_effects',
    question: 'Efectos secundarios',
    paths: ['raw_answers.beluga.sideEffects'],
    transform: labelValue,
  },
  {
    id: 'nrx_response_to_med',
    question: 'Como esta respondiendo al medicamento?',
    paths: ['raw_answers.beluga.responseToMed'],
    transform: labelValue,
  },
  {
    id: 'nrx_dose_preference',
    question: 'Como desea continuar el tratamiento?',
    paths: ['raw_answers.beluga.dosePreference'],
    transform: labelValue,
  },
  {
    id: 'nrx_rx_photo',
    question: 'Tiene foto de la receta actual?',
    paths: ['raw_answers.beluga.rxPhoto'],
    transform: labelValue,
  },
  {
    id: 'nrx_rx_photo_consent',
    question: 'Consentimiento o decision sobre foto de receta',
    paths: ['raw_answers.beluga.rxPhotoConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_other_questions',
    question: 'Que otra informacion o preguntas tiene para el doctor?',
    paths: ['raw_answers.beluga.otherQuestions'],
  },
  {
    id: 'nrx_individualized_consent',
    question: 'Consentimiento de tratamiento individualizado',
    paths: ['raw_answers.beluga.individualizedConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_truthfulness_consent',
    question: 'Consentimiento de veracidad de informacion',
    paths: ['raw_answers.beluga.truthfulnessConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_glp_consent',
    question: 'Consentimiento GLP-1 / GIP',
    paths: ['raw_answers.beluga.glpConsent'],
    transform: labelValue,
  },
  {
    id: 'nrx_selected_treatment',
    question: 'Tratamiento seleccionado',
    paths: ['plan_selection.medication', 'treatment_selection.medication', 'raw_answers.intake.treatment'],
    transform: labelValue,
  },
  {
    id: 'nrx_selected_plan',
    question: 'Plan seleccionado',
    paths: ['plan_selection.plan', 'treatment_selection.plan', 'raw_answers.intake.plan'],
    transform: labelValue,
  },
];

const FALLBACK_SKIP_RAW_KEYS = new Set([
  'intake.fname',
  'intake.lname',
  'intake.phone',
  'intake.phoneCountry',
  'intake.whatsappUrl',
  'intake.email',
  'intake.dosableSessionId',
  'intake.dosableLeadId',
  'intake.planPrice',
  'beluga.email',
  'beluga.phone',
  'beluga.prefilledFromLead',
]);

function unwrapPayload(input) {
  let candidate = input && input.json ? input.json : input;

  if (Array.isArray(candidate)) {
    candidate = candidate[0] || {};
  }

  if (candidate && candidate.body && (candidate.body.event || candidate.body.contact || candidate.body.resume)) {
    return candidate.body;
  }

  if (candidate && candidate.event) {
    return candidate;
  }

  if (candidate && candidate.data && candidate.data.body) {
    return candidate.data.body;
  }

  return candidate || {};
}

function normalizeItem(inputItem) {
  const rawInput = inputItem && inputItem.json ? inputItem.json : inputItem;
  const body = unwrapPayload(inputItem);
  const eventKind = getEventKind(body);
  const awsalesEvent = getAwsalesEvent(body, eventKind);
  const timestamp = normalizeTimestamp(getFirst(body, ['abandon.detected_at', 'submitted_at', 'timestamp', 'created_at']));
  const lead = buildLead(body);
  const formAnswers = buildFormAnswers(body);
  const metadata = buildMetadata(body, eventKind, formAnswers.length);

  const awsalesPayload = stripUndefined({
    event: awsalesEvent,
    timestamp,
    form: {
      id: CONFIG.formId,
      name: CONFIG.formName,
    },
    lead,
    utm: buildUtm(body),
    form_answers: formAnswers,
    metadata,
  });

  if (CONFIG.includeRawPayloadInMetadata) {
    awsalesPayload.metadata.raw_payload = rawInput;
  }

  const routing = buildRouting(body, eventKind, awsalesPayload);
  const missing = requiredMissing(awsalesPayload);

  return {
    awsales_payload: awsalesPayload,
    awsales_payload_json: JSON.stringify(awsalesPayload),
    routing,
    diagnostics: {
      valid_for_awsales: missing.length === 0,
      missing_required_fields: missing,
      source_event: body.event || null,
      source_step: get(body, 'resume.step'),
      source_stage: get(body, 'resume.stage'),
      answers_count: formAnswers.length,
    },
  };
}

function buildLead(body) {
  const firstName = getFirst(body, ['contact.first_name', 'raw_answers.intake.fname']);
  const lastName = getFirst(body, ['contact.last_name', 'raw_answers.intake.lname']);
  const fullName = compactJoin([firstName, lastName], ' ');

  return stripUndefined({
    phone: getFirst(body, ['contact.phone_e164', 'raw_answers.intake.phone', 'raw_answers.beluga.phone']),
    email: getFirst(body, ['contact.email', 'raw_answers.intake.email', 'raw_answers.beluga.email']),
    name: fullName || undefined,
  });
}

function buildUtm(body) {
  return stripUndefined({
    source: get(body, 'tracking.utm_source'),
    medium: get(body, 'tracking.utm_medium'),
    campaign: get(body, 'tracking.utm_campaign'),
    content: get(body, 'tracking.utm_content'),
    term: get(body, 'tracking.utm_term'),
  });
}

function buildFormAnswers(body) {
  const answers = [];
  const coveredRawKeys = collectCoveredRawKeys();

  for (const def of QUESTION_DEFS) {
    const answerValue = getAnswerValue(body, def);
    if (isBlank(answerValue)) continue;

    answers.push({
      question_id: def.id,
      question: def.question,
      answer: stringifyAnswer(answerValue),
    });
  }

  addRawFallbackAnswers(body, answers, coveredRawKeys);

  return answers;
}

function getAnswerValue(body, def) {
  if (isInitialProfileOnly(body) && !INITIAL_PROFILE_QUESTION_IDS.has(def.id)) {
    return null;
  }

  let value = null;

  if (typeof def.get === 'function') {
    value = def.get(body);
  } else {
    value = getFirst(body, def.paths || []);
  }

  if (isBlank(value)) return null;
  return typeof def.transform === 'function' ? def.transform(value) : value;
}

function addRawFallbackAnswers(body, answers, coveredRawKeys) {
  const rawAnswers = get(body, 'raw_answers');
  if (!isPlainObject(rawAnswers)) return;

  const profileOnly = isInitialProfileOnly(body);

  for (const [blockName, block] of Object.entries(rawAnswers)) {
    if (!isPlainObject(block)) continue;
    if (profileOnly && blockName !== 'intake') continue;

    for (const [key, value] of Object.entries(block)) {
      const rawKey = `${blockName}.${key}`;

      if (coveredRawKeys.has(rawKey)) continue;
      if (FALLBACK_SKIP_RAW_KEYS.has(rawKey) || FALLBACK_SKIP_RAW_KEYS.has(key)) continue;
      if (isBlank(value)) continue;

      answers.push({
        question_id: `raw_${safeId(blockName)}_${safeId(key)}`,
        question: `Campo bruto ${blockName}.${key}`,
        answer: stringifyAnswer(labelValue(value)),
      });
    }
  }
}

function isInitialProfileOnly(body) {
  return String(get(body, 'resume.stage') || '') === 'parent' && String(get(body, 'resume.step') || '') === '4';
}

function collectCoveredRawKeys() {
  const keys = new Set(FALLBACK_SKIP_RAW_KEYS);

  for (const def of QUESTION_DEFS) {
    for (const rawKey of def.rawKeys || []) {
      keys.add(rawKey);
    }

    for (const path of def.paths || []) {
      const match = path.match(/^raw_answers\.([^.\s]+)\.([^.\s]+)$/);
      if (match) keys.add(`${match[1]}.${match[2]}`);
    }
  }

  return keys;
}

function buildMetadata(body, eventKind, answersCount) {
  const resumeUrl = getFirst(body, ['resume.cross_device_url', 'resume.url']);
  const checkoutUrl = get(body, 'checkout_url');
  const treatment = getFirst(body, ['plan_selection.medication', 'treatment_selection.medication', 'raw_answers.intake.treatment']);
  const plan = getFirst(body, ['plan_selection.plan', 'treatment_selection.plan', 'raw_answers.intake.plan']);
  const step = get(body, 'resume.step');
  const stage = get(body, 'resume.stage');
  const profileOnly = isInitialProfileOnly(body);

  return stripUndefined({
    nrx_event: get(body, 'event'),
    nrx_event_version: get(body, 'event_version'),
    event_kind: eventKind,
    recovery_type: eventKind,
    recommended_recovery_url: checkoutUrl || resumeUrl,
    form_resume_url: resumeUrl,
    checkout_url: checkoutUrl,
    resume_stage: stage,
    resume_step: step,
    resume_step_label: STEP_LABELS[String(step)] || undefined,
    resume_updated_at: get(body, 'resume.updated_at'),
    resume_cross_device_token: get(body, 'resume.cross_device_token'),
    resume_cross_device_ttl_seconds: get(body, 'resume.cross_device_ttl_seconds'),
    session_id: get(body, 'tracking.session_id'),
    dosable_lead_id: get(body, 'tracking.dosable_lead_id'),
    dosable_session_id: get(body, 'tracking.dosable_session_id'),
    progress_trigger: get(body, 'progress_trigger'),
    abandon_reason: get(body, 'abandon.reason'),
    abandon_idle_seconds: get(body, 'abandon.idle_seconds'),
    abandon_last_step: get(body, 'abandon.last_step'),
    abandon_last_event: get(body, 'abandon.last_event'),
    abandon_detected_at: get(body, 'abandon.detected_at'),
    wa_redirect: get(body, 'wa_redirect'),
    handoff_channel: get(body, 'handoff_channel'),
    source_page: get(body, 'source.page'),
    source_url: get(body, 'source.url'),
    source_lang: get(body, 'source.lang'),
    source_referrer: get(body, 'source.referrer'),
    phone_country: get(body, 'contact.phone_country'),
    whatsapp_url: get(body, 'contact.whatsapp_url'),
    lead_state: get(body, 'address.state_code'),
    lead_zip: get(body, 'address.zip'),
    lead_country: get(body, 'address.country'),
    biological_sex: labelValue(get(body, 'demographics.biological_sex')),
    age_range: get(body, 'demographics.age_range'),
    dob: profileOnly ? undefined : get(body, 'demographics.dob'),
    height_cm: get(body, 'biometrics.height_cm'),
    height_display: get(body, 'biometrics.height_display'),
    weight_kg: get(body, 'biometrics.weight_kg'),
    weight_lbs: get(body, 'biometrics.weight_lbs'),
    bmi: get(body, 'biometrics.bmi'),
    bmi_class: get(body, 'biometrics.bmi_class'),
    goal_weight: profileOnly ? undefined : getFirst(body, ['goals.weight_loss_goal', 'raw_answers.beluga.goalWeight']),
    selected_medication: profileOnly ? undefined : labelValue(treatment),
    selected_plan: profileOnly ? undefined : labelValue(plan),
    plan_price: profileOnly ? undefined : get(body, 'raw_answers.intake.planPrice'),
    eligibility_qualified: get(body, 'eligibility.qualified'),
    eligibility_state_supported: get(body, 'eligibility.state_supported'),
    can_self_inject_from_raw: profileOnly ? undefined : labelValue(get(body, 'raw_answers.beluga.injectionAbility')),
    can_self_inject_normalized: profileOnly ? undefined : get(body, 'medical_history.can_self_inject'),
    final_consents_from_raw: profileOnly ? undefined : stripUndefined({
      individualized: labelValue(get(body, 'raw_answers.beluga.individualizedConsent')),
      truthfulness: labelValue(get(body, 'raw_answers.beluga.truthfulnessConsent')),
      glp: labelValue(get(body, 'raw_answers.beluga.glpConsent')),
    }),
    form_version: get(body, 'meta.form_version'),
    answers_count: answersCount,
  });
}

function buildRouting(body, eventKind, awsalesPayload) {
  const submittedAt = awsalesPayload.timestamp;
  const delayMinutes = getDelayMinutes(eventKind);
  const dueAt = delayMinutes > 0 ? addMinutesIso(submittedAt, delayMinutes) : null;
  const stateKey = getStateKey(body, awsalesPayload.lead);
  const recoveryUrl = get(body, 'checkout_url') || getFirst(body, ['resume.cross_device_url', 'resume.url']);
  const isWaHandoff = eventKind === 'whatsapp_handoff';
  const shouldSendNow = eventKind === 'form_abandonment_confirmed';
  const shouldEverSend = !isWaHandoff &&
    !['contact_captured', 'form_progress_snapshot', 'form_completed_no_checkout'].includes(eventKind);

  return stripUndefined({
    event_kind: eventKind,
    should_send_to_awsales_now: shouldSendNow,
    should_send_after_debounce: shouldEverSend && !shouldSendNow,
    debounce_minutes: delayMinutes,
    abandonment_check_at: dueAt,
    state_key: stateKey,
    dedupe_key: buildDedupeKey(stateKey, awsalesPayload),
    recovery_url: recoveryUrl,
    recommended_action: getRecommendedAction(eventKind),
    reason: getRoutingReason(eventKind),
  });
}

function getEventKind(body) {
  const sourceEvent = get(body, 'event');
  const step = String(get(body, 'resume.step') || '');
  const hasCheckoutUrl = !isBlank(get(body, 'checkout_url'));
  const isWaHandoff =
    sourceEvent === 'intake_partial' &&
    (get(body, '_source') === 'wa-handoff' || get(body, 'wa_redirect') === true || get(body, 'handoff_channel') === 'whatsapp');

  if (isWaHandoff) return 'whatsapp_handoff';
  if (sourceEvent === 'intake_abandoned') return 'form_abandonment_confirmed';
  if (hasCheckoutUrl || sourceEvent === 'intake_plan_selected') return 'checkout_abandonment';
  if (sourceEvent === 'intake_submitted' || sourceEvent === 'intake_completed') return 'form_completed_no_checkout';
  if (sourceEvent === 'intake_progress' && (step === 'processing' || step === 'success')) return 'form_completed_no_checkout';
  if (sourceEvent === 'intake_progress') return 'form_progress_snapshot';
  if (sourceEvent === 'intake_partial') return 'contact_captured';
  return 'form_abandonment';
}

function getAwsalesEvent(body, eventKind) {
  const sourceEvent = get(body, 'event');

  if (eventKind === 'checkout_abandonment') return 'form_response';
  if (eventKind === 'form_completed_no_checkout') return 'form_response';
  if (sourceEvent === 'intake_submitted' || sourceEvent === 'intake_completed') return 'form_response';
  return 'form_response_partial';
}

function getDelayMinutes(eventKind) {
  if (eventKind === 'form_abandonment_confirmed') return 0;
  if (eventKind === 'form_abandonment') return CONFIG.defaultAbandonmentDelayMinutes;
  if (eventKind === 'checkout_abandonment') return CONFIG.defaultAbandonmentDelayMinutes;
  return 0;
}

function getRecommendedAction(eventKind) {
  const actions = {
    form_abandonment_confirmed: 'Send awsales_payload now. The Worker already waited 20 minutes and emitted intake_abandoned.',
    form_abandonment: 'Store latest state, wait 10 minutes without newer payload, then send awsales_payload.',
    contact_captured: 'Store context only. Do not trigger AWSales because the lead only captured contact and may continue.',
    form_progress_snapshot: 'Store/debug only. Do not trigger AWSales because intake_progress is a progress/autosave snapshot.',
    checkout_abandonment: 'Store latest checkout state, wait 10 minutes without purchase/output event, then send awsales_payload.',
    whatsapp_handoff: 'Store context only. Do not start outbound WhatsApp because the site already opens WhatsApp to the IA.',
    form_completed_no_checkout: 'Store context and wait for plan_selected/checkout_url or an explicit submitted event rule.',
  };

  return actions[eventKind] || actions.form_abandonment;
}

function getRoutingReason(eventKind) {
  const reasons = {
    form_abandonment_confirmed: 'The Worker durable object timed out by session_id and emitted intake_abandoned after 20 minutes.',
    form_abandonment: 'The lead is in the form flow and may still continue; debounce avoids 15 campaign inputs.',
    contact_captured: 'intake_partial only means contact was captured; the lead can still continue normally.',
    form_progress_snapshot: 'intake_progress can fire while the lead is actively moving through the form.',
    checkout_abandonment: 'The lead generated a checkout URL; debounce gives time for immediate payment before recovery.',
    whatsapp_handoff: 'Lead clicked WhatsApp handoff and will arrive inbound/receptive to the IA.',
    form_completed_no_checkout: 'The medical intake reached processing/success but no checkout URL is present in this payload.',
  };

  return reasons[eventKind] || reasons.form_abandonment;
}

function requiredMissing(payload) {
  const missing = [];

  if (isBlank(get(payload, 'event'))) missing.push('event');
  if (isBlank(get(payload, 'timestamp'))) missing.push('timestamp');
  if (isBlank(get(payload, 'form.id'))) missing.push('form.id');
  if (isBlank(get(payload, 'form.name'))) missing.push('form.name');
  if (isBlank(get(payload, 'lead.phone'))) missing.push('lead.phone');
  if (isBlank(get(payload, 'lead.email'))) missing.push('lead.email');

  return missing;
}

function getStateKey(body, lead) {
  return (
    get(body, 'tracking.session_id') ||
    get(body, 'resume.cross_device_token') ||
    get(body, 'tracking.dosable_session_id') ||
    lead.phone ||
    lead.email ||
    'unknown'
  );
}

function buildDedupeKey(stateKey, payload) {
  const fingerprint = JSON.stringify({
    stateKey,
    event: payload.event,
    sourceEvent: get(payload, 'metadata.nrx_event'),
    step: get(payload, 'metadata.resume_step'),
    checkoutUrl: get(payload, 'metadata.checkout_url'),
    answers: payload.form_answers,
  });

  return `${stateKey}:${simpleHash(fingerprint)}`;
}

function getFirst(obj, paths) {
  for (const path of paths || []) {
    const value = get(obj, path);
    if (!isBlank(value)) return value;
  }

  return null;
}

function get(obj, path, fallback = null) {
  if (!obj || !path) return fallback;

  const parts = String(path).split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return fallback;
    if (!Object.prototype.hasOwnProperty.call(current, part)) return fallback;
    current = current[part];
  }

  return current === undefined ? fallback : current;
}

function isBlank(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.filter((item) => !isBlank(item)).length === 0;
  if (isPlainObject(value)) return Object.keys(value).length === 0;
  return false;
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function cleanValue(value) {
  if (Array.isArray(value)) {
    return value.map(cleanValue).filter((item) => !isBlank(item));
  }

  if (isPlainObject(value)) {
    const output = {};
    for (const [key, item] of Object.entries(value)) {
      const cleaned = cleanValue(item);
      if (!isBlank(cleaned)) output[key] = cleaned;
    }
    return output;
  }

  if (typeof value === 'string') return value.trim();
  return value;
}

function stringifyAnswer(value) {
  const cleaned = cleanValue(value);

  if (Array.isArray(cleaned)) return cleaned.map(stringifyAnswer).join(', ');
  if (isPlainObject(cleaned)) return JSON.stringify(cleaned);
  if (typeof cleaned === 'boolean') return cleaned ? 'true' : 'false';

  return String(cleaned);
}

function labelValue(value) {
  if (isBlank(value)) return value;

  if (Array.isArray(value)) {
    return value.map(labelValue).filter((item) => !isBlank(item));
  }

  if (isPlainObject(value)) {
    const output = {};
    for (const [key, item] of Object.entries(value)) output[key] = labelValue(item);
    return output;
  }

  const raw = String(value).trim();
  const key = raw.toLowerCase();
  return VALUE_LABELS[key] || raw;
}

function formatMeasure(label, value) {
  if (isBlank(value)) return null;
  return `${label}: ${stringifyAnswer(labelValue(value))}`;
}

function compactJoin(values, separator) {
  return values.filter((value) => !isBlank(value)).map(stringifyAnswer).join(separator);
}

function formatDob(month, day, year) {
  if (isBlank(month) || isBlank(day) || isBlank(year)) return null;
  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
}

function normalizeTimestamp(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function addMinutesIso(timestamp, minutes) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function stripUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(stripUndefined).filter((item) => !isBlank(item));
  }

  if (isPlainObject(value)) {
    const output = {};

    for (const [key, item] of Object.entries(value)) {
      if (item === undefined || item === null) continue;
      if (isPlainObject(item)) {
        const nested = stripUndefined(item);
        if (!isBlank(nested)) output[key] = nested;
        continue;
      }
      output[key] = item;
    }

    return output;
  }

  return value;
}

function safeId(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function simpleHash(input) {
  let hash = 5381;
  const text = String(input);

  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) + hash) + text.charCodeAt(i);
    hash &= 0xffffffff;
  }

  return Math.abs(hash).toString(36);
}

const inputItems = $input.all();
return inputItems.map((item) => ({ json: normalizeItem(item) }));
