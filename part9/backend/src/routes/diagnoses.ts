import express from "express";

const router = express.Router();

const diagnoses = [
    { "code": "K35.80", "name": "Acute appendicitis" },
    { "code": "R10.0", "name": "Acute abdomen" },
    { "code": "I10", "name": "Essential (primary) hypertension" },
    { "code": "E11", "name": "Type 2 diabetes mellitus" },
    { "code": "J45", "name": "Asthma" },
    { "code": "F32", "name": "Depressive episode" },
    { "code": "C50", "name": "Malignant neoplasm of breast" },
    { "code": "M54.5", "name": "Low back pain" },
    { "code": "K21.0", "name": "Gastro-esophageal reflux disease" },
    { "code": "N39.0", "name": "Urinary tract infection, site not specified" },
    { "code": "A09", "name": "Diarrhea and gastroenteritis of presumed infectious origin" },
    { "code": "J06.9", "name": "Acute upper respiratory infection, unspecified" },
    { "code": "G43.9", "name": "Migraine, unspecified" },
    { "code": "L20.9", "name": "Atopic dermatitis, unspecified" },
    { "code": "H52.1", "name": "Myopia" },
    { "code": "K29.7", "name": "Gastritis, unspecified" },
    { "code": "M25.5", "name": "Pain in joint" },
    { "code": "F41.1", "name": "Generalized anxiety disorder" },
    { "code": "J18.9", "name": "Pneumonia, unspecified organism" },
    { "code": "E66.9", "name": "Obesity, unspecified" },
    { "code": "R51", "name": "Headache" },
    { "code": "H10.9", "name": "Conjunctivitis, unspecified" },
    { "code": "K35.80", "name": "Unspecified acute appendicitis" }
];

router.get("/", (_req, res) => {
    res.json(diagnoses);
});

export default router;
