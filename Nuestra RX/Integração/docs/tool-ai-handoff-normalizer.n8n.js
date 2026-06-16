function parseMaybeJson(value) {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (!trimmed) return value;

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    // Repair: a IA serializa estes campos como string JSON e as vezes quebra o escaping
    // (caso real 2026-06-10: altura 5'7" virou "5'7"" e o metadata veio com aspa extra
    // depois do } final). Sem o repair o parse falha silencioso, o campo vira string e o
    // backfill inteiro morre. Tentar consertos conhecidos antes de desistir.
    const fixInchQuote = (text) => text.replace(/(\d)'(\d+)""/g, '$1\'$2\\""');
    const fixTrailingQuote = (text) => text.replace(/([}\]])\s*"+\s*$/, '$1');

    const candidates = [
      fixTrailingQuote(trimmed),
      fixInchQuote(trimmed),
      fixTrailingQuote(fixInchQuote(trimmed)),
    ];

    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate);
      } catch (innerError) {
        // tenta o proximo conserto
      }
    }

    return value;
  }
}

function normalizeProduct(value) {
  const raw = String(value || '').trim().toLowerCase();

  const map = {
    semaglutida: 'semaglutide',
    semaglutide: 'semaglutide',
    tirzepatida: 'tirzepatide',
    tirzepatide: 'tirzepatide',
  };

  return map[raw] || value;
}

function normalizePlan(value) {
  const raw = String(value || '').trim().toLowerCase();

  const map = {
    mensual: 'monthly',
    monthly: 'monthly',
    '1_month': 'monthly',
    '1_months': 'monthly',
    trimestral: 'quarterly',
    quarterly: 'quarterly',
    '3_month': 'quarterly',
    '3_months': 'quarterly',
    '3_month_plan': 'quarterly',
    '3_months_plan': 'quarterly',
    '3 month plan': 'quarterly',
    '3 months plan': 'quarterly',
    '3 meses': 'quarterly',
    'plan de 3 meses': 'quarterly',
    rush: 'rush',
  };

  return map[raw] || value;
}

function normalizeGender(value) {
  const raw = String(value || '').trim().toLowerCase();

  const map = {
    m: 'Male',
    male: 'Male',
    hombre: 'Male',
    masculino: 'Male',
    f: 'Female',
    female: 'Female',
    mujer: 'Female',
    femenino: 'Female',
    other: 'Other',
    otro: 'Other',
  };

  return map[raw] || value;
}

function isBlank(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.filter((item) => !isBlank(item)).length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

function firstNonBlank(values) {
  for (const value of values) {
    if (!isBlank(value)) return value;
  }

  return undefined;
}

function splitFullName(value) {
  const parts = String(value || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return {};

  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(' '),
  };
}

function normalizeBirthday(value) {
  if (isBlank(value)) return undefined;

  const raw = String(value).trim();

  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return `${isoMatch[2].padStart(2, '0')}/${isoMatch[3].padStart(2, '0')}/${isoMatch[1]}`;
  }

  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    return `${slashMatch[1].padStart(2, '0')}/${slashMatch[2].padStart(2, '0')}/${slashMatch[3]}`;
  }

  return raw;
}

function normalizeDateOfBirthIso(value) {
  if (isBlank(value)) return undefined;

  const raw = String(value).trim();

  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`;
  }

  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    return `${slashMatch[3]}-${slashMatch[1].padStart(2, '0')}-${slashMatch[2].padStart(2, '0')}`;
  }

  return raw;
}

function normalizeContact(body, metadata = {}, lead = {}) {
  const contact = parseMaybeJson(body.contact) || {};
  const splitName = splitFullName(firstNonBlank([contact.name, contact.full_name, body.name, body.full_name]));
  const shippingAddress = parseMaybeJson(contact.shipping_address) || contact.shipping_address;
  const leadName = splitFullName(lead.name);
  const birthdaySource = firstNonBlank([
    contact.birthday,
    contact.date_of_birth,
    contact.dateOfBirth,
    contact.dob,
    body.birthday,
    body.date_of_birth,
    body.dateOfBirth,
    body.dob,
    metadata.birthday,
    metadata.dob,
  ]);
  const birthday = normalizeBirthday(birthdaySource);
  const dateOfBirthIso = normalizeDateOfBirthIso(birthdaySource);

  return {
    ...contact,
    first_name: firstNonBlank([contact.first_name, contact.firstName, contact.firstname, body.first_name, body.firstName, splitName.first_name, lead.first_name, leadName.first_name, metadata.lead_first_name]),
    last_name: firstNonBlank([contact.last_name, contact.lastName, contact.lastname, body.last_name, body.lastName, splitName.last_name, lead.last_name, leadName.last_name, metadata.lead_last_name]),
    email: firstNonBlank([contact.email, body.email, lead.email]),
    phone: firstNonBlank([contact.phone, contact.phone_e164, contact.phoneE164, body.phone, body.phone_e164, body.phoneE164, lead.phone]),
    lead_state: firstNonBlank([
      contact.lead_state,
      contact.leadState,
      contact.state,
      contact.state_code,
      contact.stateCode,
      body.lead_state,
      body.leadState,
      body.state,
      body.state_code,
      body.stateCode,
      metadata.lead_state,
      shippingAddress && shippingAddress.state,
    ]),
    gender: normalizeGender(firstNonBlank([contact.gender, contact.sex, contact.biological_sex, body.gender, body.sex, body.biological_sex, metadata.biological_sex])),
    // MM/DD/YYYY e o formato comprovado: o teste real Silvia Xavier (lead Dosable
    // criado do zero) retornou ok:true com date_of_birth/birthday em MM/DD. Mantemos
    // date_of_birth_iso so como referencia interna; nao e o que vai no body.
    date_of_birth: birthday,
    date_of_birth_iso: dateOfBirthIso,
    birthday,
    shipping_address: shippingAddress,
  };
}

function getMissingRequiredContactFields(contact) {
  return ['first_name', 'last_name', 'email', 'phone', 'lead_state'].filter((field) => isBlank(contact[field]));
}

// Schema oficial Dosable Tenant 64 (fonte: handoff-awsales-20260528/awsales_t64_schema.json).
// id -> tipo + opcoes validas (+ label curto em espanhol). Fonte da verdade para VALIDAR
// cada answer antes de enviar e nunca mandar valor fora das opcoes (que causa 400/502).
const QUESTION_SCHEMA = {
  '6400': { type: 'textarea', label: 'Condiciones medicas actuales' },
  '6401': { type: 'textarea', label: 'Medicamentos actuales' },
  '6402': { type: 'textarea', label: 'Alergias conocidas' },
  '6403': { type: 'radio', options: ['Male', 'Female'], label: 'Sexo biologico' },
  '6404': { type: 'radio', options: ['Yes', 'No'], label: 'Esta embarazada, amamantando o planeando embarazo?' },
  '6406': { type: 'textarea', label: 'Mayor peso alcanzado (lbs)' },
  '6407': { type: 'textarea', label: 'Altura (pies y pulgadas)' },
  '6408': { type: 'textarea', label: 'Peso actual (lbs)' },
  '6410': { type: 'radio', options: ['Actively managing', 'Some efforts', 'No active efforts'], label: 'Enfoque actual con el peso' },
  '6411': { type: 'checkbox', options: ['Gastroparesis (Paralysis of your intestines)', 'Triglycerides over 600 at any point', 'Pancreatic cancer or pancreatitis', 'Type 1 Diabetes/Insulin-dependent diabetes', 'Hypoglycemia (low blood sugar)', 'Personal or family history of medullary thyroid cancer', 'Personal or family history of Multiple Endocrine Neoplasia (MEN-2) syndrome', 'Anorexia or bulimia', 'Liver failure/liver cirrhosis', 'Chronic Kidney Disease Stage 3b or greater', 'Syndrome of Inappropriate Antidiuretic hormone', 'Current symptomatic gallstones', 'Current gallstones without symptoms', 'Past removal of your gallbladder', 'Hypothyroidism, Hyperthyroidism, or Thyroid Issues', 'None of the above'], label: 'Condiciones medicas (lista)' },
  '6415': { type: 'radio', options: ['Yes', 'No'], label: 'Bypass gastrico en los ultimos 6 meses?' },
  '6416': { type: 'checkbox', options: ['Ozempic (Semaglutide)', 'Mounjaro (Tirzepatide)', 'Wegovy (Semaglutide)', 'Zepbound (Tirzepatide)', 'Saxenda (Liraglutide)', 'Trulicity (dulaglutide)', 'None of the above'], label: 'Alergia a medicamentos GLP-1 (lista)' },
  '6417': { type: 'checkbox', options: ['Semaglutide (Ozempic, Wegovy, Rybelsus)', 'Tirzepatide (Zepbound, Mounjaro)', 'None of these'], label: 'Uso reciente de GLP-1 (lista)' },
  '6418': { type: 'radio', options: ["No, I'd need an oral option instead (Direct to oral formulation or disqualified if not offered)", 'Yes, I can inject myself or have reliable help'], label: 'Capacidad de auto-inyeccion' },
  '6431': { type: 'consent', options: ['I have read and understand the above information and I do consent and wish to move forward with this treatment plan', 'I have read the above information and I do not wish to continue'], label: 'Consentimiento de tratamiento individualizado' },
  '6432': { type: 'consent', options: ['I have read the above information and I do consent and wish to move forward', 'I have read the above information and I do not wish to continue'], label: 'Consentimiento de veracidad' },
  '6433': { type: 'consent', options: ['I have read and understand the above information and I wish to continue', 'I have read the above information and I do not wish to continue'], label: 'Consentimiento GLP-1' },
};

function looksLikeDateValue(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v) || /^\d{4}-\d{1,2}-\d{1,2}$/.test(v);
}

// A IA ja mapeou dados de contato dentro de answers (caso real 2026-06-10: 6400 = nome,
// 6401 = sobrenome, 6403 = email). Textarea aceita texto livre, entao sem este guard o
// nome do lead iria para a Dosable como "condicao medica".
function looksLikeContactValue(value, contact) {
  if (!contact) return false;

  const v = String(value ?? '').trim().toLowerCase();
  if (!v) return false;

  const fields = [contact.first_name, contact.last_name, contact.email, contact.phone];
  return fields.some((field) => !isBlank(field) && String(field).trim().toLowerCase() === v);
}

function isValidAnswerForSchema(id, value, contact) {
  const sch = QUESTION_SCHEMA[String(id)];
  if (!sch) return !isBlank(value);
  if (sch.type === 'textarea') {
    // texto livre, mas nunca uma data pura (data de nascimento vai so em contact)
    // nem um dado de contato (nome/email/telefone nao sao resposta clinica)
    return !isBlank(value) && !looksLikeDateValue(value) && !looksLikeContactValue(value, contact);
  }
  if (sch.type === 'checkbox') {
    const arr = toArray(value);
    return arr.length > 0 && arr.every((v) => sch.options.includes(v));
  }
  // radio / consent: valor unico tem que estar nas opcoes validas
  if (Array.isArray(value)) return false;
  return sch.options.includes(value);
}

// Remove answers com valor invalido para o schema Dosable (ex: data de nascimento em
// 6404, opcao fora da lista, nome/email do lead em textarea). Garante que o /ai-handoff
// nunca recebe valor invalido (evita 400/502). O que cair fora vira "faltante" -> a IA
// pede de novo ou o backfill preenche.
function sanitizeAnswers(answers, contact) {
  for (const id of Object.keys(answers)) {
    const value = answers[id] && answers[id].value;
    if (!isValidAnswerForSchema(id, value, contact)) {
      delete answers[id];
    }
  }
  return answers;
}

function getMissingRequiredAnswerIds(answers) {
  const required = [
    '6400',
    '6401',
    '6402',
    '6403',
    '6404',
    '6406',
    '6407',
    '6408',
    '6410',
    '6411',
    '6415',
    '6416',
    '6417',
    '6418',
    '6431',
    '6432',
    '6433',
  ];

  return required.filter((id) => isBlank(answers[id] && answers[id].value));
}

function buildMissingDataResponse(missingContactFields, missingAnswerIds) {
  if (!missingContactFields.length && !missingAnswerIds.length) return null;

  const missingAnswers = missingAnswerIds.map((id) => ({
    id,
    pregunta: (QUESTION_SCHEMA[String(id)] && QUESTION_SCHEMA[String(id)].label) || id,
  }));

  return {
    ok: false,
    error: 'missing_required_data',
    missing_contact_fields: missingContactFields,
    missing_answer_ids: missingAnswerIds,
    missing_answers: missingAnswers,
    message: 'Faltan datos obligatorios para generar el checkout. Pide esos datos al lead antes de llamar la tool otra vez.',
  };
}

function normalizeYesNo(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';

  const raw = String(value ?? '').trim().toLowerCase();

  if (['yes', 'si', 's\u00ed', 'sã­', 'sim', 'y', 'true'].includes(raw)) return 'Yes';
  if (['no', 'n', 'false'].includes(raw)) return 'No';

  return value;
}

function normalizeConsentValue(id, value) {
  const normalized = normalizeYesNo(value);
  const raw = String(value ?? '').trim().toLowerCase();

  const accepted = normalized === 'Yes' || [
    'accept',
    'acepto',
    'aceptado',
    'accepted',
    'confirmo',
    'confirmado',
    'consiento',
  ].includes(raw);

  if (!accepted) return value;

  if (id === '6431') return 'I have read and understand the above information and I do consent and wish to move forward with this treatment plan';
  if (id === '6432') return 'I have read the above information and I do consent and wish to move forward';
  if (id === '6433') return 'I have read and understand the above information and I wish to continue';

  return value;
}

function normalizeInjectionAbility(value) {
  const normalized = normalizeYesNo(value);
  const raw = String(value ?? '').trim().toLowerCase();
  const compact = raw.replace(/[^a-zA-Z0-9]/g, '');

  if (normalized === 'Yes') return 'Yes, I can inject myself or have reliable help';
  if (normalized === 'No') return "No, I'd need an oral option instead (Direct to oral formulation or disqualified if not offered)";
  if ([
    'selfinject',
    'selfinjection',
    'caninject',
    'canselfinject',
    'canselfinjection',
    'icaninject',
    'icaninjectmyself',
    'puedoinyectarme',
    'sipuedeinyectarme',
    'sipuedoinyectarmeyomismo',
  ].includes(compact)) return 'Yes, I can inject myself or have reliable help';
  if (raw === 'self-inject') return 'Yes, I can inject myself or have reliable help';

  return value;
}

function normalizeApproach(value) {
  const raw = String(value ?? '').trim().toLowerCase();

  const map = {
    active: 'Actively managing',
    actively_managing: 'Actively managing',
    'actively managing': 'Actively managing',
    some_efforts: 'Some efforts',
    'some efforts': 'Some efforts',
    some: 'Some efforts',
    attempted: 'Some efforts',
    no_active_efforts: 'No active efforts',
    'no active efforts': 'No active efforts',
    none: 'No active efforts',
    ninguno: 'No active efforts',
    ninguna: 'No active efforts',
    'aun no he empezado un plan claro': 'No active efforts',
    'aún no he empezado un plan claro': 'No active efforts',
    'no he empezado': 'No active efforts',
    'algunos esfuerzos': 'Some efforts',
    'manejando activamente': 'Actively managing',
    activamente: 'Actively managing',
  };

  return map[raw] || value;
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === '') return [];
  return [value];
}

function normalizeMedicalConditions(value) {
  const values = toArray(value);
  const output = [];

  const map = {
    none: 'None of the above',
    no: 'None of the above',
    ninguno: 'None of the above',
    ninguna: 'None of the above',
    noneoftheabove: 'None of the above',
    gallstonesasymptomatic: 'Current gallstones without symptoms',
    currentgallstoneswithoutsymptoms: 'Current gallstones without symptoms',
    currentgallstones: 'Current gallstones without symptoms',
    gallstones: 'Current gallstones without symptoms',
    symptomaticgallstones: 'Current symptomatic gallstones',
    currentsymptomaticgallstones: 'Current symptomatic gallstones',
    cholecystectomy: 'Past removal of your gallbladder',
    gallbladderremoved: 'Past removal of your gallbladder',
    pastremovalofyourgallbladder: 'Past removal of your gallbladder',
    thyroid: 'Hypothyroidism, Hyperthyroidism, or Thyroid Issues',
    thyroidissues: 'Hypothyroidism, Hyperthyroidism, or Thyroid Issues',
    hypothyroidism: 'Hypothyroidism, Hyperthyroidism, or Thyroid Issues',
    hyperthyroidism: 'Hypothyroidism, Hyperthyroidism, or Thyroid Issues',
  };

  for (const item of values) {
    const compact = String(item ?? '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const mapped = map[compact] || item;
    if (mapped && !output.includes(mapped)) output.push(mapped);
  }

  return output.length ? output : ['None of the above'];
}

function normalizeGeneralAllergies(value) {
  const values = toArray(value);
  const output = [];

  const map = {
    none: 'None',
    no: 'None',
    ninguno: 'None',
    ninguna: 'None',
    noneoftheabove: 'None',
    noneofthese: 'None',
    nka: 'None',
    nkda: 'None',
  };

  for (const item of values) {
    const compact = String(item ?? '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const mapped = map[compact] || item;
    if (mapped && !output.includes(mapped)) output.push(mapped);
  }

  if (!output.length) return value;
  return output.length === 1 ? output[0] : output.join(', ');
}

function normalizeFreeTextNone(value) {
  const values = toArray(value);
  const output = values
    .map((item) => String(item ?? '').trim())
    .filter(Boolean);

  if (!output.length) return 'None';

  const compactValues = output.map((item) => item.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
  if (compactValues.every((item) => ['none', 'no', 'ninguno', 'ninguna'].includes(item))) return 'None';

  return output.join(', ');
}

function normalizeGlpAllergies(value) {
  const values = toArray(value);
  const output = [];

  const map = {
    none: 'None of the above',
    no: 'None of the above',
    ninguno: 'None of the above',
    ninguna: 'None of the above',
    noneoftheabove: 'None of the above',
    noneofthese: 'None of the above',
    ozempic: 'Ozempic (Semaglutide)',
    semaglutide: 'Ozempic (Semaglutide)',
    semaglutida: 'Ozempic (Semaglutide)',
    mounjaro: 'Mounjaro (Tirzepatide)',
    tirzepatide: 'Mounjaro (Tirzepatide)',
    tirzepatida: 'Mounjaro (Tirzepatide)',
    wegovy: 'Wegovy (Semaglutide)',
    zepbound: 'Zepbound (Tirzepatide)',
    saxenda: 'Saxenda (Liraglutide)',
    trulicity: 'Trulicity (dulaglutide)',
  };

  for (const item of values) {
    const compact = String(item ?? '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const mapped = map[compact] || item;
    if (mapped && !output.includes(mapped)) output.push(mapped);
  }

  return output.length ? output : ['None of the above'];
}

function normalizePriorGlp1Use(value) {
  const values = toArray(value);
  const output = [];

  const map = {
    none: 'None of these',
    no: 'None of these',
    ninguno: 'None of these',
    ninguna: 'None of these',
    noneofthese: 'None of these',
    semaglutide: 'Semaglutide (Ozempic, Wegovy, Rybelsus)',
    semaglutida: 'Semaglutide (Ozempic, Wegovy, Rybelsus)',
    ozempic: 'Semaglutide (Ozempic, Wegovy, Rybelsus)',
    wegovy: 'Semaglutide (Ozempic, Wegovy, Rybelsus)',
    rybelsus: 'Semaglutide (Ozempic, Wegovy, Rybelsus)',
    tirzepatide: 'Tirzepatide (Zepbound, Mounjaro)',
    tirzepatida: 'Tirzepatide (Zepbound, Mounjaro)',
    zepbound: 'Tirzepatide (Zepbound, Mounjaro)',
    mounjaro: 'Tirzepatide (Zepbound, Mounjaro)',
  };

  for (const item of values) {
    const compact = String(item ?? '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const mapped = map[compact] || item;
    if (mapped && !output.includes(mapped)) output.push(mapped);
  }

  return output.length ? output : ['None of these'];
}

function formatHeightFromCm(value) {
  const match = String(value ?? '').match(/\d+(?:[.,]\d+)?/);
  const cm = match ? Number(match[0].replace(',', '.')) : NaN;
  if (!Number.isFinite(cm) || cm <= 0) return value;

  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  return `${feet}'${inches}"`;
}

function formatLbsFromKg(value) {
  const kg = Number(value);
  if (!Number.isFinite(kg) || kg <= 0) return value;

  return String(Math.round(kg * 2.2046226218));
}

function normalizeWeightNumber(value, sourceKey = '', questionText = '') {
  const text = String(value ?? '').trim();
  const numberMatch = text.match(/\d+(?:[.,]\d+)?/);
  if (!numberMatch) return value;

  const numeric = Number(numberMatch[0].replace(',', '.'));
  if (!Number.isFinite(numeric) || numeric <= 0) return value;

  if (/kg|kilo/i.test(text) || shouldTreatAsKg(sourceKey, questionText)) {
    return formatLbsFromKg(numeric);
  }

  return String(Math.round(numeric));
}

function getAnswerValue(entry) {
  if (entry && typeof entry === 'object' && Object.prototype.hasOwnProperty.call(entry, 'value')) {
    return entry.value;
  }

  return entry;
}

function setAnswer(target, id, value) {
  if (value === null || value === undefined || value === '') return;
  target[String(id)] = { value };
}

function shouldTreatAsCm(sourceKey, questionText, value) {
  const source = String(sourceKey || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const question = String(questionText || '').toLowerCase();
  const text = String(value ?? '').toLowerCase();
  const match = text.match(/\d+(?:[.,]\d+)?/);
  const numericValue = match ? Number(match[0].replace(',', '.')) : NaN;

  if (source.includes('heightcm')) return true;
  if (question.includes('cm') || question.includes('centimet')) return true;
  if (text.includes('cm') || text.includes('centimet')) return true;
  return Number.isFinite(numericValue) && numericValue > 100;
}

function shouldTreatAsKg(sourceKey, questionText) {
  const source = String(sourceKey || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const question = String(questionText || '').toLowerCase();

  if (source.includes('weightkg')) return true;
  if (question.includes('kg') || question.includes('kilo')) return true;
  return false;
}

function normalizeAnswerValueById(id, value, sourceKey = '', questionText = '') {
  if (id === '6400' || id === '6401') return normalizeFreeTextNone(value);
  if (id === '6402') return normalizeGeneralAllergies(value);
  if (id === '6403') return normalizeGender(value);
  if (id === '6404') return normalizeYesNo(value);
  if (id === '6406') return normalizeWeightNumber(value, sourceKey, questionText);
  if (id === '6407' && shouldTreatAsCm(sourceKey, questionText, value)) return formatHeightFromCm(value);
  if (id === '6408') return normalizeWeightNumber(value, sourceKey, questionText);
  if (id === '6410') return normalizeApproach(value);
  if (id === '6411') return normalizeMedicalConditions(value);
  if (id === '6415') return normalizeYesNo(value);
  if (id === '6416') return normalizeGlpAllergies(value);
  if (id === '6417') return normalizePriorGlp1Use(value);
  if (id === '6418') return normalizeInjectionAbility(value);
  if (id === '6431' || id === '6432' || id === '6433') return normalizeConsentValue(id, value);

  return value;
}

function looksLikeMedicationQuestion(questionText) {
  const question = String(questionText || '').toLowerCase();
  return question.includes('medicamento') || question.includes('medication') || question.includes('recetado');
}

function looksLikeBirthdayQuestion(questionText) {
  const question = String(questionText || '').toLowerCase();
  return question.includes('fecha de nacimiento') || question.includes('date of birth') || question.includes('birthday');
}

function normalizeAnswers(value) {
  const input = parseMaybeJson(value) || {};
  const output = {};

  const aliasToId = {
    medicalconditions: '6400',
    conditionsquick: '6400',
    currentmeds: '6401',
    currentmedications: '6401',
    medications: '6401',
    allergies: '6402',
    allergieslist: '6402',
    biologicalsex: '6403',
    sex: '6403',
    gender: '6403',
    pregnancy: '6404',
    highestweight: '6406',
    heightdisplay: '6407',
    height: '6407',
    heightcm: '6407',
    weightlbs: '6408',
    weight: '6408',
    weightkg: '6408',
    bmiconsent: '6409',
    approach: '6410',
    conditions: '6411',
    gastricbypass: '6415',
    drugallergies: '6416',
    glpallergies: '6416',
    priorglp1use: '6417',
    injectionability: '6418',
    othersquestions: '6430',
    otherquestions: '6430',
  };

  for (const [key, entry] of Object.entries(input)) {
    const value = getAnswerValue(entry);
    const compactKey = String(key).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    if (/^\d+$/.test(String(key))) {
      // Data de nascimento NUNCA e answer (vai so em contact). Pega qualquer ID que a IA
      // rotule como nascimento (ja aconteceu em 6400 e em 6404 = gravidez).
      if (looksLikeBirthdayQuestion(entry && entry.question)) {
        continue;
      }

      if (String(key) === '6404' && looksLikeMedicationQuestion(entry && entry.question)) {
        if (!output['6401']) setAnswer(output, '6401', value);
        continue;
      }

      setAnswer(output, key, normalizeAnswerValueById(String(key), value, compactKey, entry && entry.question));
      continue;
    }

    if (compactKey === 'finalconsents' || compactKey === 'finalconsent') {
      setAnswer(output, '6431', 'I have read and understand the above information and I do consent and wish to move forward with this treatment plan');
      setAnswer(output, '6432', 'I have read the above information and I do consent and wish to move forward');
      setAnswer(output, '6433', 'I have read and understand the above information and I wish to continue');
      continue;
    }

    const id = aliasToId[compactKey];
    if (!id) continue;

    setAnswer(output, id, normalizeAnswerValueById(id, value, compactKey, entry && entry.question));
  }

  return output;
}

function getFormAnswer(formAnswers, questionId) {
  if (!Array.isArray(formAnswers)) return null;

  return formAnswers.find((item) => item && item.question_id === questionId) || null;
}

function normalizeFormAnswers(value) {
  const parsed = parseMaybeJson(value) || [];

  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.items)) return parsed.items;
  if (Array.isArray(parsed.form_answers)) return parsed.form_answers;
  if (Array.isArray(parsed.formAnswers)) return parsed.formAnswers;
  if (typeof parsed === 'object') return Object.values(parsed).filter((item) => item && typeof item === 'object');

  return [];
}

function extractLabeledAnswer(answer, label) {
  const text = String(answer || '');
  const pattern = new RegExp(`${label}:\\s*([^|]+)`, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

function getFormAnswerText(formAnswers, questionId) {
  const item = getFormAnswer(formAnswers, questionId);
  return item ? item.answer : null;
}

function convertWeightTextToLbs(value) {
  return normalizeWeightNumber(value);
}

function stringifyMedicalConditions(value) {
  const normalized = normalizeMedicalConditions(value);
  if (!normalized.length) return 'None';
  if (normalized.length === 1 && normalized[0] === 'None of the above') return 'None';
  return normalized.join(', ');
}

function mergeContextAnswers(answers, metadata, formAnswers, contact) {
  const ensure = (id, value, sourceKey = '', questionText = '') => {
    if (answers[id] && !isBlank(answers[id].value)) return;
    setAnswer(answers, id, normalizeAnswerValueById(id, value, sourceKey, questionText));
  };

  ensure('6403', metadata.biological_sex, 'metadata.biological_sex');
  ensure('6407', firstNonBlank([metadata.height_display, metadata.height_cm]), metadata.height_display ? 'metadata.height_display' : 'metadata.height_cm');
  ensure('6408', firstNonBlank([metadata.weight_lbs, metadata.weight_kg]), metadata.weight_lbs ? 'metadata.weight_lbs' : 'metadata.weight_kg');

  const meds = getFormAnswerText(formAnswers, 'nrx_takes_rx_meds');
  ensure('6401', firstNonBlank([
    extractLabeledAnswer(meds, 'Medicamentos'),
    meds,
    metadata.current_medications,
  ]), 'form_answers_or_metadata.current_medications');

  const allergies = getFormAnswerText(formAnswers, 'nrx_allergies');
  ensure('6402', firstNonBlank([
    extractLabeledAnswer(allergies, 'Alergias'),
    allergies,
    metadata.allergies,
  ]), 'form_answers_or_metadata.allergies');

  const highestWeight = getFormAnswerText(formAnswers, 'nrx_highest_weight');
  ensure('6406', firstNonBlank([
    convertWeightTextToLbs(highestWeight),
    metadata.highest_weight,
  ]), metadata.highest_weight_unit ? `metadata.highest_weight_${metadata.highest_weight_unit}` : 'form_answers_or_metadata.highest_weight', metadata.highest_weight_unit);

  ensure('6410', firstNonBlank([
    getFormAnswerText(formAnswers, 'nrx_weight_management_approach'),
    metadata.weight_management_approach,
  ]), 'form_answers_or_metadata.weight_management_approach');
  ensure('6411', firstNonBlank([
    getFormAnswerText(formAnswers, 'nrx_conditions'),
    metadata.medical_conditions,
  ]), 'form_answers_or_metadata.medical_conditions');
  ensure('6400', stringifyMedicalConditions(answers['6411'] && answers['6411'].value), 'answers.6411');
  ensure('6415', firstNonBlank([
    getFormAnswerText(formAnswers, 'nrx_gastric_bypass_recent'),
    metadata.gastric_bypass,
  ]), 'form_answers_or_metadata.gastric_bypass');
  // 6417 (uso recente de GLP-1) nao e hard stop; default seguro "None of these" quando nao
  // ha sinal de uso previo (avatar majoritariamente primeira vez). Se houver dado, usa o dado.
  ensure('6417', firstNonBlank([
    metadata.prior_glp1_use,
    'None of these',
  ]), 'metadata_or_default.prior_glp1_use');
  ensure('6416', firstNonBlank([
    getFormAnswerText(formAnswers, 'nrx_glp1_drug_allergies'),
    metadata.glp1_drug_allergies,
  ]), 'form_answers_or_metadata.glp1_drug_allergies');
  ensure('6418', firstNonBlank([
    getFormAnswerText(formAnswers, 'nrx_injection_ability'),
    metadata.can_self_inject_from_raw,
  ]), 'form_answers_or_metadata.injection_ability');

  // Consentimentos finais: reaproveita o que o lead ja aceitou no formulario
  // (metadata.final_consents_from_raw), evitando re-perguntar os 3 consentimentos.
  const finalConsents = metadata.final_consents_from_raw || {};
  ensure('6431', finalConsents.individualized, 'metadata.final_consents.individualized');
  ensure('6432', finalConsents.truthfulness, 'metadata.final_consents.truthfulness');
  ensure('6433', finalConsents.glp, 'metadata.final_consents.glp');

  if (normalizeGender(contact.gender) === 'Male') {
    setAnswer(answers, '6404', 'No');
  } else {
    // 6404 = gravidez (hard stop). Mulher: usa o dado do form/metadata; se nao houver,
    // fica faltante e a IA pergunta (nunca chuta nem usa data de nascimento).
    ensure('6404', firstNonBlank([
      getFormAnswerText(formAnswers, 'raw_beluga_pregnancy'),
      metadata.pregnancy_status,
      metadata.pregnancy,
    ]), 'form_or_metadata.pregnancy');
  }
}

const body = $json.body || {};
const metadata = parseMaybeJson(body.metadata) || {};
const formAnswers = normalizeFormAnswers(body.form_answers);
const lead = parseMaybeJson(body.lead) || {};
const contact = normalizeContact(body, metadata, lead);
const answers = normalizeAnswers(body.answers);
const normalizedGender = normalizeGender(contact.gender);
const missingRequiredContactFields = getMissingRequiredContactFields(contact);

if (!answers['6403'] && normalizedGender) {
  setAnswer(answers, '6403', normalizedGender);
}

// Validacao contra o schema ANTES do backfill: derruba qualquer valor invalido que a IA
// mandou (ex: data de nascimento em 6404, nome do lead em 6400), para o backfill
// conseguir preencher de novo.
sanitizeAnswers(answers, contact);

mergeContextAnswers(answers, metadata, formAnswers, contact);

// Validacao final: garante que nenhum answer invalido vai para o Dosable.
sanitizeAnswers(answers, contact);

const missingRequiredAnswerIds = getMissingRequiredAnswerIds(answers);
const missingDataResponse = buildMissingDataResponse(missingRequiredContactFields, missingRequiredAnswerIds);
const readyForHttp = !missingDataResponse;

const normalizedContact = {
  ...contact,
  gender: normalizedGender,
};

const outbound = {
  product: normalizeProduct(body.product),
  plan: normalizePlan(body.plan),
  first_name: normalizedContact.first_name,
  last_name: normalizedContact.last_name,
  email: normalizedContact.email,
  phone: normalizedContact.phone,
  lead_state: normalizedContact.lead_state,
  gender: normalizedContact.gender,
  // birthday e date_of_birth em MM/DD/YYYY (formato comprovado no teste Silvia).
  // Obs: para lead JA existente na Dosable (abandono reaproveitado) o endpoint
  // valida o birthday salvo no registro durante o abandono — nenhum campo daqui
  // sobrescreve isso. Esse caso e bloqueio do lado Dosable, nao do normalizador.
  birthday: normalizedContact.birthday,
  date_of_birth: normalizedContact.birthday,
  contact: normalizedContact,
  answers,
  source: parseMaybeJson(body.source),
};

// Passthrough da sessao Dosable existente (criada no abandono, chega via metadata).
// Quando o lead JA tem sessao aberta, o endpoint cai em complete_session daquela
// sessao. Enviar os IDs explicitamente serve para: (1) apontar exatamente qual
// sessao/lead completar e (2) dar ao endpoint a chance de atualizar o birthday do
// registro com o valor que enviamos. So enviamos quando existem — lead novo nao
// manda nada, deixando o endpoint criar do zero (caminho ja comprovado).
// Mandamos os aliases session_id/lead_id (iguais aos da resposta do endpoint) e
// os dosable_*; campos extras nao reconhecidos sao ignorados pelo endpoint.
const dosableSessionId = firstNonBlank([metadata.dosable_session_id, body.dosable_session_id, body.session_id]);
const dosableLeadId = firstNonBlank([metadata.dosable_lead_id, body.dosable_lead_id, body.lead_id]);

if (!isBlank(dosableSessionId)) {
  outbound.session_id = dosableSessionId;
  outbound.dosable_session_id = dosableSessionId;
}

if (!isBlank(dosableLeadId)) {
  outbound.lead_id = dosableLeadId;
  outbound.dosable_lead_id = dosableLeadId;
}

return [
  {
    json: {
      ...outbound,
      outbound,
      outbound_json: JSON.stringify(outbound),
      should_call_http: readyForHttp,
      tool_response: missingDataResponse,
      tool_response_json: missingDataResponse ? JSON.stringify(missingDataResponse) : null,
      diagnostics: {
        ready_for_http: readyForHttp,
        missing_required_contact_fields: missingRequiredContactFields,
        missing_required_answer_ids: missingRequiredAnswerIds,
      },
    },
  },
];
