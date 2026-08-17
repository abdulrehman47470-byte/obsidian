import type { GraphDataset, GraphEdge, GraphNode, RelationshipType } from '../types/graph'

// ---------------------------------------------------------------------------
// GeneSight mock biomedical knowledge graph.
// Entity IDs are namespaced by type prefix (g_ gene, p_ protein, d_ disease,
// c_ compound, dr_ drug, m_ mutation, pw_ pathway, pub_ publication,
// ct_ clinical trial, proc_ process, t_ target) so relationships read clearly.
// This file is the only place that should be replaced when swapping in a
// real Neo4j/FastAPI-backed dataset — see src/services/graphService.ts.
// ---------------------------------------------------------------------------

let edgeSeq = 0
function edge(
  source: string,
  relationship: RelationshipType,
  target: string,
  opts: Partial<Omit<GraphEdge, 'id' | 'source' | 'target' | 'relationship'>> = {},
): GraphEdge {
  edgeSeq += 1
  return {
    id: `e${edgeSeq}`,
    source,
    target,
    relationship,
    confidence: opts.confidence ?? 0.75,
    evidenceCount: opts.evidenceCount ?? 3,
    sourceDatabase: opts.sourceDatabase ?? ['GeneSight KG'],
    publicationIds: opts.publicationIds ?? [],
    lastUpdated: opts.lastUpdated ?? '2026-06-01',
  }
}

// ---------------------------------------------------------------------------
// Genes (20)
// ---------------------------------------------------------------------------
const genes: GraphNode[] = [
  { id: 'g_tp53', label: 'TP53', type: 'gene', importance: 0.98, description: 'Tumor protein p53. The most frequently mutated gene in human cancer; guards genome integrity by triggering cell-cycle arrest, senescence, or apoptosis in response to DNA damage.', metadata: { organism: 'Human', chromosome: '17p13.1' } },
  { id: 'g_brca1', label: 'BRCA1', type: 'gene', importance: 0.92, description: 'Breast cancer type 1 susceptibility gene. Encodes a tumor suppressor central to homologous recombination DNA repair.', metadata: { organism: 'Human', chromosome: '17q21.31' } },
  { id: 'g_brca2', label: 'BRCA2', type: 'gene', importance: 0.9, description: 'Breast cancer type 2 susceptibility gene. Partners with RAD51 in homologous recombination repair of double-strand breaks.', metadata: { organism: 'Human', chromosome: '13q13.1' } },
  { id: 'g_egfr', label: 'EGFR', type: 'gene', importance: 0.88, description: 'Epidermal growth factor receptor. Receptor tyrosine kinase frequently mutated or amplified in non-small cell lung cancer and glioblastoma.', metadata: { organism: 'Human', chromosome: '7p11.2' } },
  { id: 'g_kras', label: 'KRAS', type: 'gene', importance: 0.91, description: 'KRAS proto-oncogene, GTPase. One of the most commonly mutated oncogenes across colorectal, pancreatic, and lung cancers.', metadata: { organism: 'Human', chromosome: '12p12.1' } },
  { id: 'g_braf', label: 'BRAF', type: 'gene', importance: 0.85, description: 'Serine/threonine kinase in the MAPK/ERK pathway. V600E is the dominant activating mutation in melanoma.', metadata: { organism: 'Human', chromosome: '7q34' } },
  { id: 'g_apoe', label: 'APOE', type: 'gene', importance: 0.8, description: "Apolipoprotein E. The ε4 allele is the strongest common genetic risk factor for late-onset Alzheimer's disease.", metadata: { organism: 'Human', chromosome: '19q13.32' } },
  { id: 'g_app', label: 'APP', type: 'gene', importance: 0.82, description: "Amyloid precursor protein. Proteolytic processing generates amyloid-beta, the principal component of Alzheimer's plaques.", metadata: { organism: 'Human', chromosome: '21q21.3' } },
  { id: 'g_psen1', label: 'PSEN1', type: 'gene', importance: 0.75, description: "Presenilin 1. Catalytic core of gamma-secretase; mutations cause early-onset familial Alzheimer's disease.", metadata: { organism: 'Human', chromosome: '14q24.2' } },
  { id: 'g_cisd1', label: 'CISD1', type: 'gene', importance: 0.55, description: 'CDGSH iron-sulfur domain 1 (mitoNEET). Outer mitochondrial membrane protein implicated in iron homeostasis and ferroptosis resistance.', metadata: { organism: 'Human', chromosome: '10q21.2' } },
  { id: 'g_cisd2', label: 'CISD2', type: 'gene', importance: 0.6, description: 'CDGSH iron-sulfur domain 2 (NAF-1). Regulates autophagy and mitochondrial iron-sulfur cluster transfer; mutated in Wolfram syndrome type 2.', metadata: { organism: 'Human', chromosome: '4q24' } },
  { id: 'g_cisd3', label: 'CISD3', type: 'gene', importance: 0.4, description: 'CDGSH iron-sulfur domain 3 (MiNT). Mitochondrial matrix paralog of CISD1/CISD2 involved in Fe-S cluster homeostasis.', metadata: { organism: 'Human', chromosome: '2p24.1' } },
  { id: 'g_pten', label: 'PTEN', type: 'gene', importance: 0.83, description: 'Phosphatase and tensin homolog. Lipid phosphatase that antagonizes PI3K/AKT signaling; one of the most commonly lost tumor suppressors.', metadata: { organism: 'Human', chromosome: '10q23.31' } },
  { id: 'g_myc', label: 'MYC', type: 'gene', importance: 0.78, description: 'MYC proto-oncogene, transcription factor. Master regulator of proliferation, frequently amplified across cancer types.', metadata: { organism: 'Human', chromosome: '8q24.21' } },
  { id: 'g_rb1', label: 'RB1', type: 'gene', importance: 0.7, description: 'RB transcriptional corepressor 1. Prototypical tumor suppressor controlling the G1/S cell-cycle checkpoint.', metadata: { organism: 'Human', chromosome: '13q14.2' } },
  { id: 'g_alk', label: 'ALK', type: 'gene', importance: 0.68, description: 'ALK receptor tyrosine kinase. EML4-ALK gene fusions define a targetable subset of non-small cell lung cancer.', metadata: { organism: 'Human', chromosome: '2p23.2-p23.1' } },
  { id: 'g_met', label: 'MET', type: 'gene', importance: 0.6, description: 'MET proto-oncogene, receptor tyrosine kinase. Amplification drives resistance to EGFR-targeted therapy.', metadata: { organism: 'Human', chromosome: '7q31.2' } },
  { id: 'g_pik3ca', label: 'PIK3CA', type: 'gene', importance: 0.72, description: 'Phosphatidylinositol-4,5-bisphosphate 3-kinase catalytic subunit alpha. Core PI3K/AKT/mTOR pathway oncogene.', metadata: { organism: 'Human', chromosome: '3q26.32' } },
  { id: 'g_notch1', label: 'NOTCH1', type: 'gene', importance: 0.58, description: 'Notch receptor 1. Context-dependent oncogene/tumor suppressor regulating cell-fate decisions.', metadata: { organism: 'Human', chromosome: '9q34.3' } },
  { id: 'g_jak2', label: 'JAK2', type: 'gene', importance: 0.65, description: 'Janus kinase 2. V617F mutation is the principal driver of myeloproliferative neoplasms including polycythemia vera.', metadata: { organism: 'Human', chromosome: '9p24.1' } },
]

// ---------------------------------------------------------------------------
// Proteins (20) — one per gene product, id p_<gene suffix>
// ---------------------------------------------------------------------------
const proteinDefs: Array<[string, string, string, number]> = [
  ['p_tp53', 'P53', 'Transcription factor that binds DNA damage-response elements to induce p21, PUMA, and other effectors of arrest/apoptosis.', 0.97],
  ['p_brca1', 'BRCA1', 'E3 ubiquitin ligase and scaffold protein that recruits repair machinery to double-strand breaks.', 0.9],
  ['p_brca2', 'BRCA2', 'Loads RAD51 onto resected DNA ends to catalyze strand invasion during homologous recombination.', 0.88],
  ['p_egfr', 'EGFR', 'Transmembrane receptor tyrosine kinase activating RAS/MAPK and PI3K/AKT signaling upon ligand binding.', 0.87],
  ['p_kras', 'KRAS', 'Small GTPase acting as a binary molecular switch for RAS/MAPK signal transduction.', 0.9],
  ['p_braf', 'BRAF', 'Serine/threonine kinase that phosphorylates MEK1/2 downstream of RAS.', 0.84],
  ['p_apoe', 'ApoE', 'Lipid transport protein; the ε4 isoform impairs amyloid-beta clearance in the brain.', 0.78],
  ['p_app', 'APP', 'Transmembrane protein cleaved by secretases to release amyloid-beta peptides.', 0.8],
  ['p_psen1', 'Presenilin-1', 'Catalytic subunit of the gamma-secretase complex that cleaves APP.', 0.74],
  ['p_cisd1', 'CISD1 (mitoNEET)', 'Outer mitochondrial membrane [2Fe-2S] protein regulating iron transfer and mitochondrial metabolism.', 0.5],
  ['p_cisd2', 'CISD2 (NAF-1)', 'ER/mitochondria-associated [2Fe-2S] protein regulating autophagy and calcium signaling.', 0.56],
  ['p_cisd3', 'CISD3 (MiNT)', 'Mitochondrial matrix [2Fe-2S] cluster protein supporting Fe-S enzyme biogenesis.', 0.38],
  ['p_pten', 'PTEN', 'Phosphatase converting PIP3 back to PIP2, the principal brake on PI3K/AKT signaling.', 0.81],
  ['p_myc', 'MYC', 'bHLH-LZ transcription factor driving ribosome biogenesis and cell-cycle entry genes.', 0.76],
  ['p_rb1', 'RB1', 'Pocket protein that sequesters E2F transcription factors to block S-phase entry.', 0.68],
  ['p_alk', 'ALK', 'Receptor tyrosine kinase; EML4-ALK fusion constitutively activates downstream MAPK/STAT signaling.', 0.66],
  ['p_met', 'MET', 'Hepatocyte growth factor receptor tyrosine kinase promoting invasive growth.', 0.58],
  ['p_pik3ca', 'PI3K p110α', 'Catalytic subunit generating PIP3 to recruit and activate AKT at the membrane.', 0.7],
  ['p_notch1', 'Notch-1', 'Single-pass receptor whose cleaved intracellular domain acts as a transcriptional co-activator.', 0.55],
  ['p_jak2', 'JAK2', 'Cytoplasmic tyrosine kinase transducing cytokine receptor signals via STAT phosphorylation.', 0.63],
]
const proteins: GraphNode[] = proteinDefs.map(([id, label, description, importance]) => ({
  id,
  label,
  type: 'protein',
  description,
  importance,
  metadata: { organism: 'Human' },
}))

// ---------------------------------------------------------------------------
// Diseases (15)
// ---------------------------------------------------------------------------
const diseases: GraphNode[] = [
  { id: 'd_breast_cancer', label: 'Breast Cancer', type: 'disease', importance: 0.9, description: 'Malignant neoplasm of breast tissue; hereditary risk strongly linked to BRCA1/BRCA2 mutations.' },
  { id: 'd_ovarian_cancer', label: 'Ovarian Cancer', type: 'disease', importance: 0.78, description: 'Malignancy of ovarian tissue with strong BRCA1/BRCA2 and TP53 hereditary associations.' },
  { id: 'd_colorectal_cancer', label: 'Colorectal Cancer', type: 'disease', importance: 0.82, description: 'Cancer of the colon or rectum; frequently driven by APC, KRAS, and TP53 alterations.' },
  { id: 'd_nsclc', label: 'Non-Small Cell Lung Cancer', type: 'disease', importance: 0.85, description: 'The most common lung cancer subtype; EGFR, ALK, KRAS, and MET are major targetable drivers.' },
  { id: 'd_melanoma', label: 'Melanoma', type: 'disease', importance: 0.75, description: 'Aggressive skin cancer arising from melanocytes; BRAF V600E present in ~50% of cases.' },
  { id: 'd_alzheimers', label: "Alzheimer's Disease", type: 'disease', importance: 0.88, description: 'Progressive neurodegenerative disease characterized by amyloid plaques and tau tangles.' },
  { id: 'd_pancreatic_cancer', label: 'Pancreatic Cancer', type: 'disease', importance: 0.7, description: 'Highly lethal malignancy with near-universal KRAS mutation.' },
  { id: 'd_cml', label: 'Chronic Myeloid Leukemia', type: 'disease', importance: 0.6, description: 'Myeloproliferative neoplasm driven by the BCR-ABL fusion kinase.' },
  { id: 'd_glioblastoma', label: 'Glioblastoma', type: 'disease', importance: 0.72, description: 'The most aggressive primary brain tumor in adults; frequent EGFR amplification and PTEN loss.' },
  { id: 'd_prostate_cancer', label: 'Prostate Cancer', type: 'disease', importance: 0.68, description: 'Common malignancy of the prostate gland with androgen-driven and PTEN-loss subtypes.' },
  { id: 'd_li_fraumeni', label: 'Li-Fraumeni Syndrome', type: 'disease', importance: 0.5, description: 'Rare hereditary cancer predisposition syndrome caused by germline TP53 mutations.' },
  { id: 'd_retinoblastoma', label: 'Retinoblastoma', type: 'disease', importance: 0.45, description: 'Pediatric retinal cancer caused by biallelic RB1 inactivation.' },
  { id: 'd_wolfram2', label: 'Wolfram Syndrome Type 2', type: 'disease', importance: 0.3, description: 'Rare autosomal recessive disorder caused by CISD2 mutations, marked by mitochondrial dysfunction.' },
  { id: 'd_polycythemia_vera', label: 'Polycythemia Vera', type: 'disease', importance: 0.48, description: 'Myeloproliferative neoplasm driven by JAK2 V617F, causing excess red blood cell production.' },
  { id: 'd_dlbcl', label: 'Diffuse Large B-Cell Lymphoma', type: 'disease', importance: 0.55, description: 'The most common aggressive non-Hodgkin lymphoma subtype, with frequent MYC and NOTCH1 dysregulation.' },
]

// ---------------------------------------------------------------------------
// Pathways (15)
// ---------------------------------------------------------------------------
const pathways: GraphNode[] = [
  { id: 'pw_p53', label: 'p53 Signaling Pathway', type: 'pathway', importance: 0.85, description: 'Network of stress-response genes activated by p53 to enforce cell-cycle arrest or apoptosis.' },
  { id: 'pw_pi3k_akt_mtor', label: 'PI3K/AKT/mTOR Pathway', type: 'pathway', importance: 0.85, description: 'Central growth and survival signaling cascade frequently hyperactivated in cancer.' },
  { id: 'pw_mapk_erk', label: 'MAPK/ERK Signaling Pathway', type: 'pathway', importance: 0.86, description: 'RAS-RAF-MEK-ERK cascade controlling proliferation and differentiation.' },
  { id: 'pw_apoptosis', label: 'Apoptosis', type: 'pathway', importance: 0.75, description: 'Programmed cell death pathway executed by caspase cascades.' },
  { id: 'pw_cell_cycle', label: 'Cell Cycle Regulation', type: 'pathway', importance: 0.8, description: 'Checkpoint network controlling transitions between G1, S, G2, and M phases.' },
  { id: 'pw_ddr', label: 'DNA Damage Response', type: 'pathway', importance: 0.82, description: 'Sensor and effector network that detects DNA lesions and coordinates repair or apoptosis.' },
  { id: 'pw_notch', label: 'Notch Signaling Pathway', type: 'pathway', importance: 0.55, description: 'Juxtacrine signaling pathway governing cell-fate specification.' },
  { id: 'pw_jak_stat', label: 'JAK/STAT Signaling Pathway', type: 'pathway', importance: 0.6, description: 'Cytokine receptor signaling cascade transducing extracellular signals to gene transcription.' },
  { id: 'pw_egfr_signaling', label: 'EGFR Signaling Pathway', type: 'pathway', importance: 0.78, description: 'Receptor tyrosine kinase cascade initiated by EGFR ligand binding.' },
  { id: 'pw_wnt', label: 'Wnt Signaling Pathway', type: 'pathway', importance: 0.6, description: 'Beta-catenin-dependent pathway regulating stem cell maintenance and proliferation.' },
  { id: 'pw_amyloidogenic', label: 'Amyloidogenic Processing Pathway', type: 'pathway', importance: 0.7, description: 'Sequential beta- and gamma-secretase cleavage of APP producing amyloid-beta.' },
  { id: 'pw_fe_s_homeostasis', label: 'Iron-Sulfur Cluster Homeostasis', type: 'pathway', importance: 0.4, description: 'Biogenesis and trafficking pathway for [Fe-S] cofactors required by mitochondrial enzymes.' },
  { id: 'pw_ferroptosis', label: 'Ferroptosis Regulation', type: 'pathway', importance: 0.5, description: 'Iron-dependent lipid peroxidation cell death pathway counter-regulated by GPX4 and CISD proteins.' },
  { id: 'pw_hrr', label: 'Homologous Recombination Repair', type: 'pathway', importance: 0.75, description: 'High-fidelity double-strand break repair pathway using a sister chromatid template.' },
  { id: 'pw_vegf', label: 'VEGF Signaling Pathway', type: 'pathway', importance: 0.55, description: 'Signaling cascade driving endothelial proliferation and new blood vessel formation.' },
]

// ---------------------------------------------------------------------------
// Biological processes (8)
// ---------------------------------------------------------------------------
const processes: GraphNode[] = [
  { id: 'proc_senescence', label: 'Cellular Senescence', type: 'process', importance: 0.5, description: 'Stable proliferative arrest state triggered by stress or telomere attrition.' },
  { id: 'proc_autophagy', label: 'Autophagy', type: 'process', importance: 0.5, description: 'Catabolic process degrading and recycling cellular components via the lysosome.' },
  { id: 'proc_oxidative_stress', label: 'Oxidative Stress Response', type: 'process', importance: 0.55, description: 'Cellular program counteracting reactive oxygen species accumulation.' },
  { id: 'proc_iron_homeostasis', label: 'Iron Homeostasis', type: 'process', importance: 0.4, description: 'Regulation of cellular and systemic iron uptake, storage, and export.' },
  { id: 'proc_angiogenesis', label: 'Angiogenesis', type: 'process', importance: 0.55, description: 'Formation of new blood vessels from existing vasculature.' },
  { id: 'proc_dna_repair', label: 'DNA Repair', type: 'process', importance: 0.6, description: 'Broad cellular process correcting DNA lesions to preserve genome integrity.' },
  { id: 'proc_inflammatory_response', label: 'Inflammatory Response', type: 'process', importance: 0.45, description: 'Immune-driven response to tissue damage or pathogens.' },
  { id: 'proc_mito_dysfunction', label: 'Mitochondrial Dysfunction', type: 'process', importance: 0.5, description: 'Impairment of mitochondrial bioenergetics and quality control implicated in neurodegeneration and aging.' },
]

// ---------------------------------------------------------------------------
// Therapeutic targets (10) — validated drug-binding targets not otherwise
// represented as a gene/protein node in this demo dataset.
// ---------------------------------------------------------------------------
const targets: GraphNode[] = [
  { id: 't_gpx4', label: 'GPX4', type: 'target', importance: 0.5, description: 'Glutathione peroxidase 4; the master negative regulator of ferroptosis.' },
  { id: 't_wee1', label: 'WEE1', type: 'target', importance: 0.45, description: 'G2/M checkpoint kinase; inhibition forces mitotic entry with unrepaired DNA damage.' },
  { id: 't_erk', label: 'ERK1/2', type: 'target', importance: 0.55, description: 'Terminal kinases of the MAPK cascade; direct effectors of RAS/RAF/MEK signaling.' },
  { id: 't_akt', label: 'AKT', type: 'target', importance: 0.6, description: 'Serine/threonine kinase downstream of PI3K driving survival and metabolic signaling.' },
  { id: 't_hsp90', label: 'HSP90', type: 'target', importance: 0.4, description: 'Molecular chaperone stabilizing numerous oncogenic client kinases.' },
  { id: 't_mek', label: 'MEK1/2', type: 'target', importance: 0.55, description: 'Dual-specificity kinases that activate ERK1/2 in the MAPK cascade.' },
  { id: 't_parp1', label: 'PARP1', type: 'target', importance: 0.6, description: 'DNA repair enzyme whose inhibition is synthetically lethal with BRCA1/2 loss.' },
  { id: 't_bcr_abl', label: 'BCR-ABL', type: 'target', importance: 0.5, description: 'Constitutively active fusion tyrosine kinase driving chronic myeloid leukemia.' },
  { id: 't_ache', label: 'Acetylcholinesterase', type: 'target', importance: 0.4, description: 'Enzyme that degrades acetylcholine at cholinergic synapses; a symptomatic target in Alzheimer’s disease.' },
  { id: 't_mtor', label: 'mTOR', type: 'target', importance: 0.5, description: 'Serine/threonine kinase integrating nutrient and growth-factor signals to control cell growth.' },
]

// ---------------------------------------------------------------------------
// Compounds — investigational (20)
// ---------------------------------------------------------------------------
const compounds: GraphNode[] = [
  { id: 'c_erastin', label: 'Erastin', type: 'compound', importance: 0.4, description: 'Small-molecule ferroptosis inducer that indirectly inhibits system xc- cystine/glutamate antiport.' },
  { id: 'c_rsl3', label: 'RSL3', type: 'compound', importance: 0.4, description: 'Covalent GPX4 inhibitor used as a ferroptosis-inducing chemical probe.' },
  { id: 'c_nutlin3a', label: 'Nutlin-3a', type: 'compound', importance: 0.5, description: 'MDM2 antagonist that stabilizes and reactivates wild-type p53.' },
  { id: 'c_prima1', label: 'PRIMA-1', type: 'compound', importance: 0.42, description: 'Small molecule that restores wild-type conformation and function to mutant p53.' },
  { id: 'c_apr246', label: 'APR-246 (Eprenetapopt)', type: 'compound', importance: 0.48, description: 'Methylated derivative of PRIMA-1 in clinical development as a mutant p53 reactivator.' },
  { id: 'c_adavosertib', label: 'Adavosertib (AZD1775)', type: 'compound', importance: 0.45, description: 'Selective WEE1 kinase inhibitor that abrogates the G2/M checkpoint.' },
  { id: 'c_plx4720', label: 'PLX4720', type: 'compound', importance: 0.5, description: 'Selective BRAF V600E inhibitor tool compound; direct chemical precursor of vemurafenib.' },
  { id: 'c_gdc0994', label: 'GDC-0994', type: 'compound', importance: 0.35, description: 'Selective ERK1/2 inhibitor developed for RAS/RAF-mutant tumors.' },
  { id: 'c_ipatasertib', label: 'Ipatasertib', type: 'compound', importance: 0.45, description: 'ATP-competitive pan-AKT inhibitor investigated in PTEN-deficient and PIK3CA-mutant tumors.' },
  { id: 'c_buparlisib', label: 'Buparlisib', type: 'compound', importance: 0.4, description: 'Pan-class I PI3K inhibitor evaluated across PIK3CA-altered solid tumors.' },
  { id: 'c_onalespib', label: 'Onalespib', type: 'compound', importance: 0.3, description: 'Second-generation HSP90 inhibitor investigated as a client-protein degrader.' },
  { id: 'c_ml210', label: 'ML210', type: 'compound', importance: 0.32, description: 'Covalent GPX4 inhibitor structurally distinct from RSL3, used to induce ferroptosis.' },
  { id: 'c_fin56', label: 'FIN56', type: 'compound', importance: 0.3, description: 'Ferroptosis inducer that depletes GPX4 protein and coenzyme Q10.' },
  { id: 'c_deferoxamine', label: 'Deferoxamine', type: 'compound', importance: 0.35, description: 'Iron chelator used experimentally to probe mitochondrial iron-dependent processes.' },
  { id: 'c_ars853', label: 'ARS-853', type: 'compound', importance: 0.38, description: 'Covalent tool compound targeting KRAS G12C in its inactive GDP-bound state.' },
  { id: 'c_mrtx1257', label: 'Compound MRTX-1257', type: 'compound', importance: 0.36, description: 'Investigational covalent KRAS G12C inhibitor tool compound.' },
  { id: 'c_sch772984', label: 'SCH772984', type: 'compound', importance: 0.33, description: 'Potent ATP-competitive ERK1/2 inhibitor used widely as a research probe.' },
  { id: 'c_ly3009120', label: 'LY3009120', type: 'compound', importance: 0.34, description: 'Pan-RAF inhibitor designed to overcome paradoxical MAPK pathway activation.' },
  { id: 'c_torin1', label: 'Torin1', type: 'compound', importance: 0.3, description: 'ATP-competitive mTOR inhibitor blocking both mTORC1 and mTORC2 complexes.' },
  { id: 'c_scrambled_probe', label: 'CISD-Probe-19', type: 'compound', importance: 0.25, description: 'Experimental small molecule probe used to study CISD3 iron-sulfur cluster transfer kinetics.' },
]

// ---------------------------------------------------------------------------
// Drugs — approved (10)
// ---------------------------------------------------------------------------
const drugs: GraphNode[] = [
  { id: 'dr_vemurafenib', label: 'Vemurafenib', type: 'drug', importance: 0.6, description: 'First-in-class BRAF V600E inhibitor approved for metastatic melanoma.' },
  { id: 'dr_dabrafenib', label: 'Dabrafenib', type: 'drug', importance: 0.55, description: 'BRAF inhibitor commonly combined with trametinib in BRAF-mutant melanoma.' },
  { id: 'dr_trametinib', label: 'Trametinib', type: 'drug', importance: 0.55, description: 'MEK1/2 inhibitor used in combination with BRAF inhibitors to delay resistance.' },
  { id: 'dr_osimertinib', label: 'Osimertinib', type: 'drug', importance: 0.65, description: 'Third-generation EGFR TKI active against the T790M resistance mutation.' },
  { id: 'dr_erlotinib', label: 'Erlotinib', type: 'drug', importance: 0.5, description: 'First-generation reversible EGFR tyrosine kinase inhibitor.' },
  { id: 'dr_olaparib', label: 'Olaparib', type: 'drug', importance: 0.62, description: 'First-in-class PARP inhibitor approved for BRCA-mutated ovarian and breast cancer.' },
  { id: 'dr_talazoparib', label: 'Talazoparib', type: 'drug', importance: 0.5, description: 'Highly potent PARP inhibitor with strong PARP-trapping activity.' },
  { id: 'dr_imatinib', label: 'Imatinib', type: 'drug', importance: 0.58, description: 'First targeted BCR-ABL kinase inhibitor, transforming CML treatment.' },
  { id: 'dr_ruxolitinib', label: 'Ruxolitinib', type: 'drug', importance: 0.5, description: 'JAK1/JAK2 inhibitor approved for polycythemia vera and myelofibrosis.' },
  { id: 'dr_donepezil', label: 'Donepezil', type: 'drug', importance: 0.45, description: "Acetylcholinesterase inhibitor used for symptomatic treatment of Alzheimer's disease." },
]

// ---------------------------------------------------------------------------
// Mutations (15)
// ---------------------------------------------------------------------------
const mutations: Array<{ id: string; label: string; gene: string; protein: string; description: string }> = [
  { id: 'm_tp53_r175h', label: 'TP53 R175H', gene: 'g_tp53', protein: 'p_tp53', description: 'Structural hotspot mutation that destabilizes the p53 DNA-binding domain.' },
  { id: 'm_tp53_r273h', label: 'TP53 R273H', gene: 'g_tp53', protein: 'p_tp53', description: 'Contact hotspot mutation that abolishes direct DNA binding by p53.' },
  { id: 'm_brca1_185delag', label: 'BRCA1 185delAG', gene: 'g_brca1', protein: 'p_brca1', description: 'Frameshift founder mutation causing premature truncation of BRCA1.' },
  { id: 'm_brca2_6174delt', label: 'BRCA2 6174delT', gene: 'g_brca2', protein: 'p_brca2', description: 'Frameshift founder mutation truncating the BRCA2 protein.' },
  { id: 'm_egfr_l858r', label: 'EGFR L858R', gene: 'g_egfr', protein: 'p_egfr', description: 'Activating kinase domain mutation sensitizing tumors to EGFR TKIs.' },
  { id: 'm_egfr_t790m', label: 'EGFR T790M', gene: 'g_egfr', protein: 'p_egfr', description: 'Gatekeeper mutation conferring resistance to first-generation EGFR inhibitors.' },
  { id: 'm_kras_g12d', label: 'KRAS G12D', gene: 'g_kras', protein: 'p_kras', description: 'Common activating mutation impairing GTPase activity, locking KRAS in its active state.' },
  { id: 'm_kras_g12c', label: 'KRAS G12C', gene: 'g_kras', protein: 'p_kras', description: 'Activating mutation creating a druggable cysteine pocket exploited by covalent inhibitors.' },
  { id: 'm_braf_v600e', label: 'BRAF V600E', gene: 'g_braf', protein: 'p_braf', description: 'Dominant activating mutation constitutively engaging MAPK signaling.' },
  { id: 'm_pten_r130g', label: 'PTEN R130G', gene: 'g_pten', protein: 'p_pten', description: 'Catalytic-site mutation abolishing PTEN phosphatase activity.' },
  { id: 'm_apoe_e4', label: 'APOE ε4', gene: 'g_apoe', protein: 'p_apoe', description: "Common allele variant associated with elevated Alzheimer's disease risk." },
  { id: 'm_psen1_m146v', label: 'PSEN1 M146V', gene: 'g_psen1', protein: 'p_psen1', description: 'Familial early-onset Alzheimer’s mutation altering gamma-secretase cleavage specificity.' },
  { id: 'm_rb1_r661w', label: 'RB1 R661W', gene: 'g_rb1', protein: 'p_rb1', description: 'Missense mutation disrupting the RB1 pocket domain required for E2F binding.' },
  { id: 'm_jak2_v617f', label: 'JAK2 V617F', gene: 'g_jak2', protein: 'p_jak2', description: 'Constitutively activating mutation driving cytokine-independent JAK/STAT signaling.' },
  { id: 'm_alk_eml4', label: 'EML4-ALK Fusion', gene: 'g_alk', protein: 'p_alk', description: 'Gene fusion generating a constitutively active ALK kinase.' },
]

// ---------------------------------------------------------------------------
// Publications (20)
// ---------------------------------------------------------------------------
const publications: Array<{ id: string; label: string; description: string; year: number }> = [
  { id: 'pub_1', label: 'PMID:24651012', description: 'Structural basis of p53 hotspot mutations and loss of DNA-binding function.', year: 2014 },
  { id: 'pub_2', label: 'PMID:25813012', description: 'BRCA1/2 mutation spectrum and hereditary breast-ovarian cancer risk.', year: 2015 },
  { id: 'pub_3', label: 'PMID:26244001', description: 'EGFR L858R and T790M: mechanisms of sensitivity and acquired resistance.', year: 2016 },
  { id: 'pub_4', label: 'PMID:27098233', description: 'KRAS G12C: an emerging druggable oncogenic pocket.', year: 2016 },
  { id: 'pub_5', label: 'PMID:23430089', description: 'BRAF V600E signaling and the clinical development of vemurafenib.', year: 2013 },
  { id: 'pub_6', label: 'PMID:28812044', description: 'APOE ε4 genotype and amyloid-beta clearance in the aging brain.', year: 2017 },
  { id: 'pub_7', label: 'PMID:29310567', description: 'PSEN1 mutations and gamma-secretase dysregulation in familial Alzheimer’s disease.', year: 2018 },
  { id: 'pub_8', label: 'PMID:30122456', description: 'CISD2 and mitochondrial iron-sulfur cluster transfer in Wolfram syndrome type 2.', year: 2018 },
  { id: 'pub_9', label: 'PMID:31287345', description: 'mitoNEET (CISD1) as a regulator of ferroptosis sensitivity.', year: 2019 },
  { id: 'pub_10', label: 'PMID:32209871', description: 'PTEN loss and PI3K/AKT/mTOR pathway hyperactivation across solid tumors.', year: 2020 },
  { id: 'pub_11', label: 'PMID:33017623', description: 'MYC amplification and transcriptional addiction in aggressive lymphomas.', year: 2020 },
  { id: 'pub_12', label: 'PMID:34456712', description: 'RB1 loss of function and cell-cycle checkpoint failure in retinoblastoma.', year: 2021 },
  { id: 'pub_13', label: 'PMID:35098234', description: 'EML4-ALK fusion biology and resistance mechanisms in NSCLC.', year: 2022 },
  { id: 'pub_14', label: 'PMID:36187345', description: 'MET amplification as a bypass resistance mechanism to EGFR inhibition.', year: 2022 },
  { id: 'pub_15', label: 'PMID:37045612', description: 'PIK3CA hotspot mutations and response to PI3K pathway inhibitors.', year: 2023 },
  { id: 'pub_16', label: 'PMID:37789456', description: 'NOTCH1 dysregulation in diffuse large B-cell lymphoma.', year: 2023 },
  { id: 'pub_17', label: 'PMID:38234567', description: 'JAK2 V617F allele burden and clinical phenotype in polycythemia vera.', year: 2024 },
  { id: 'pub_18', label: 'PMID:38912345', description: 'Nutlin-3a and small-molecule reactivation of wild-type p53 function.', year: 2024 },
  { id: 'pub_19', label: 'PMID:39056781', description: 'PARP inhibitor synthetic lethality in BRCA1/2-deficient tumors: a decade in review.', year: 2024 },
  { id: 'pub_20', label: 'PMID:39344512', description: 'GPX4 inhibition and ferroptosis as an anticancer strategy: preclinical progress.', year: 2025 },
]

// ---------------------------------------------------------------------------
// Clinical trials (10)
// ---------------------------------------------------------------------------
const clinicalTrials: Array<{ id: string; label: string; description: string; phase: string }> = [
  { id: 'ct_1', label: 'NCT01006980', description: 'Phase 2 study of vemurafenib in BRAF V600E-mutant metastatic melanoma.', phase: 'Phase 2' },
  { id: 'ct_2', label: 'NCT02296125', description: 'Phase 3 study of osimertinib versus standard EGFR TKI in NSCLC.', phase: 'Phase 3' },
  { id: 'ct_3', label: 'NCT01844986', description: 'Phase 3 maintenance study of olaparib in BRCA-mutated ovarian cancer.', phase: 'Phase 3' },
  { id: 'ct_4', label: 'NCT01243944', description: 'Phase 2 study of ruxolitinib in polycythemia vera resistant to hydroxyurea.', phase: 'Phase 2' },
  { id: 'ct_5', label: 'NCT02301988', description: 'Phase 2 study of ipatasertib plus paclitaxel in PTEN-low breast cancer.', phase: 'Phase 2' },
  { id: 'ct_6', label: 'NCT02272790', description: 'Phase 1 dose-escalation study of adavosertib in recurrent ovarian cancer.', phase: 'Phase 1' },
  { id: 'ct_7', label: 'NCT03072043', description: 'Phase 1b/2 study of APR-246 combined with chemotherapy in TP53-mutant ovarian cancer.', phase: 'Phase 1b/2' },
  { id: 'ct_8', label: 'NCT01945775', description: 'Phase 3 study of talazoparib in germline BRCA-mutated advanced breast cancer.', phase: 'Phase 3' },
  { id: 'ct_9', label: 'NCT00006343', description: 'Landmark phase 3 study establishing imatinib as first-line therapy in CML.', phase: 'Phase 3' },
  { id: 'ct_10', label: 'NCT00478205', description: 'Phase 4 post-marketing study of donepezil in mild-to-moderate Alzheimer’s disease.', phase: 'Phase 4' },
]

// ---------------------------------------------------------------------------
// Node assembly
// ---------------------------------------------------------------------------
const mutationNodes: GraphNode[] = mutations.map((m) => ({
  id: m.id,
  label: m.label,
  type: 'mutation',
  description: m.description,
  importance: 0.4,
  metadata: { gene: m.gene },
}))

const publicationNodes: GraphNode[] = publications.map((p) => ({
  id: p.id,
  label: p.label,
  type: 'publication',
  description: p.description,
  importance: 0.25,
  metadata: { year: p.year },
}))

const clinicalTrialNodes: GraphNode[] = clinicalTrials.map((c) => ({
  id: c.id,
  label: c.label,
  type: 'clinical_trial',
  description: c.description,
  importance: 0.3,
  metadata: { phase: c.phase },
}))

export const nodes: GraphNode[] = [
  ...genes,
  ...proteins,
  ...diseases,
  ...pathways,
  ...processes,
  ...targets,
  ...compounds,
  ...drugs,
  ...mutationNodes,
  ...publicationNodes,
  ...clinicalTrialNodes,
]

// ---------------------------------------------------------------------------
// Edge assembly
// ---------------------------------------------------------------------------
const encodesEdges = genes.map((g) => edge(g.id, 'encodes', `p_${g.id.slice(2)}`, { confidence: 0.99, evidenceCount: 40 }))

const geneMutationEdges = mutations.flatMap((m) => [
  edge(m.gene, 'has_mutation', m.id, { confidence: 0.95, evidenceCount: 25 }),
  edge(m.id, 'affects', m.protein, { confidence: 0.9, evidenceCount: 20 }),
])

const proteinDiseaseEdges = [
  edge('p_tp53', 'associated_with', 'd_li_fraumeni', { confidence: 0.97, evidenceCount: 120 }),
  edge('p_tp53', 'associated_with', 'd_colorectal_cancer', { confidence: 0.85, evidenceCount: 210 }),
  edge('p_tp53', 'associated_with', 'd_breast_cancer', { confidence: 0.8, evidenceCount: 180 }),
  edge('p_tp53', 'associated_with', 'd_glioblastoma', { confidence: 0.75, evidenceCount: 95 }),
  edge('p_tp53', 'associated_with', 'd_pancreatic_cancer', { confidence: 0.78, evidenceCount: 88 }),
  edge('p_brca1', 'associated_with', 'd_breast_cancer', { confidence: 0.96, evidenceCount: 340 }),
  edge('p_brca1', 'associated_with', 'd_ovarian_cancer', { confidence: 0.92, evidenceCount: 260 }),
  edge('p_brca2', 'associated_with', 'd_breast_cancer', { confidence: 0.95, evidenceCount: 300 }),
  edge('p_brca2', 'associated_with', 'd_ovarian_cancer', { confidence: 0.88, evidenceCount: 190 }),
  edge('p_brca2', 'associated_with', 'd_pancreatic_cancer', { confidence: 0.7, evidenceCount: 60 }),
  edge('p_egfr', 'associated_with', 'd_nsclc', { confidence: 0.95, evidenceCount: 410 }),
  edge('p_egfr', 'associated_with', 'd_glioblastoma', { confidence: 0.72, evidenceCount: 70 }),
  edge('p_egfr', 'associated_with', 'd_colorectal_cancer', { confidence: 0.6, evidenceCount: 55 }),
  edge('p_kras', 'associated_with', 'd_colorectal_cancer', { confidence: 0.93, evidenceCount: 280 }),
  edge('p_kras', 'associated_with', 'd_nsclc', { confidence: 0.9, evidenceCount: 230 }),
  edge('p_kras', 'associated_with', 'd_pancreatic_cancer', { confidence: 0.96, evidenceCount: 320 }),
  edge('p_braf', 'associated_with', 'd_melanoma', { confidence: 0.95, evidenceCount: 260 }),
  edge('p_braf', 'associated_with', 'd_colorectal_cancer', { confidence: 0.68, evidenceCount: 65 }),
  edge('p_apoe', 'associated_with', 'd_alzheimers', { confidence: 0.94, evidenceCount: 500 }),
  edge('p_app', 'associated_with', 'd_alzheimers', { confidence: 0.96, evidenceCount: 520 }),
  edge('p_psen1', 'associated_with', 'd_alzheimers', { confidence: 0.9, evidenceCount: 240 }),
  edge('p_cisd2', 'associated_with', 'd_wolfram2', { confidence: 0.88, evidenceCount: 40 }),
  edge('p_cisd1', 'associated_with', 'd_breast_cancer', { confidence: 0.45, evidenceCount: 12 }),
  edge('p_pten', 'associated_with', 'd_glioblastoma', { confidence: 0.85, evidenceCount: 150 }),
  edge('p_pten', 'associated_with', 'd_prostate_cancer', { confidence: 0.87, evidenceCount: 160 }),
  edge('p_pten', 'associated_with', 'd_breast_cancer', { confidence: 0.65, evidenceCount: 70 }),
  edge('p_myc', 'associated_with', 'd_dlbcl', { confidence: 0.86, evidenceCount: 140 }),
  edge('p_myc', 'associated_with', 'd_breast_cancer', { confidence: 0.55, evidenceCount: 50 }),
  edge('p_rb1', 'associated_with', 'd_retinoblastoma', { confidence: 0.98, evidenceCount: 180 }),
  edge('p_rb1', 'associated_with', 'd_nsclc', { confidence: 0.5, evidenceCount: 35 }),
  edge('p_alk', 'associated_with', 'd_nsclc', { confidence: 0.9, evidenceCount: 170 }),
  edge('p_met', 'associated_with', 'd_nsclc', { confidence: 0.7, evidenceCount: 75 }),
  edge('p_met', 'associated_with', 'd_glioblastoma', { confidence: 0.5, evidenceCount: 30 }),
  edge('p_pik3ca', 'associated_with', 'd_breast_cancer', { confidence: 0.82, evidenceCount: 130 }),
  edge('p_pik3ca', 'associated_with', 'd_colorectal_cancer', { confidence: 0.6, evidenceCount: 55 }),
  edge('p_notch1', 'associated_with', 'd_dlbcl', { confidence: 0.6, evidenceCount: 45 }),
  edge('p_jak2', 'associated_with', 'd_polycythemia_vera', { confidence: 0.97, evidenceCount: 190 }),
]

const proteinPathwayEdges = [
  edge('p_tp53', 'involved_in', 'pw_p53', { confidence: 0.98, evidenceCount: 300 }),
  edge('p_tp53', 'involved_in', 'pw_apoptosis', { confidence: 0.85, evidenceCount: 150 }),
  edge('p_tp53', 'involved_in', 'pw_cell_cycle', { confidence: 0.88, evidenceCount: 160 }),
  edge('p_tp53', 'involved_in', 'pw_ddr', { confidence: 0.9, evidenceCount: 200 }),
  edge('p_brca1', 'involved_in', 'pw_ddr', { confidence: 0.92, evidenceCount: 180 }),
  edge('p_brca1', 'involved_in', 'pw_hrr', { confidence: 0.95, evidenceCount: 220 }),
  edge('p_brca1', 'involved_in', 'pw_cell_cycle', { confidence: 0.6, evidenceCount: 40 }),
  edge('p_brca2', 'involved_in', 'pw_hrr', { confidence: 0.96, evidenceCount: 230 }),
  edge('p_brca2', 'involved_in', 'pw_ddr', { confidence: 0.88, evidenceCount: 150 }),
  edge('p_egfr', 'involved_in', 'pw_egfr_signaling', { confidence: 0.97, evidenceCount: 260 }),
  edge('p_egfr', 'involved_in', 'pw_mapk_erk', { confidence: 0.85, evidenceCount: 140 }),
  edge('p_egfr', 'involved_in', 'pw_pi3k_akt_mtor', { confidence: 0.75, evidenceCount: 100 }),
  edge('p_kras', 'involved_in', 'pw_mapk_erk', { confidence: 0.95, evidenceCount: 240 }),
  edge('p_kras', 'involved_in', 'pw_pi3k_akt_mtor', { confidence: 0.65, evidenceCount: 70 }),
  edge('p_braf', 'involved_in', 'pw_mapk_erk', { confidence: 0.96, evidenceCount: 230 }),
  edge('p_apoe', 'involved_in', 'pw_amyloidogenic', { confidence: 0.5, evidenceCount: 40 }),
  edge('p_app', 'involved_in', 'pw_amyloidogenic', { confidence: 0.97, evidenceCount: 260 }),
  edge('p_psen1', 'involved_in', 'pw_amyloidogenic', { confidence: 0.95, evidenceCount: 210 }),
  edge('p_cisd1', 'involved_in', 'pw_fe_s_homeostasis', { confidence: 0.8, evidenceCount: 40 }),
  edge('p_cisd1', 'involved_in', 'pw_ferroptosis', { confidence: 0.7, evidenceCount: 30 }),
  edge('p_cisd2', 'involved_in', 'pw_fe_s_homeostasis', { confidence: 0.82, evidenceCount: 45 }),
  edge('p_cisd2', 'involved_in', 'pw_ferroptosis', { confidence: 0.65, evidenceCount: 25 }),
  edge('p_cisd3', 'involved_in', 'pw_fe_s_homeostasis', { confidence: 0.75, evidenceCount: 20 }),
  edge('p_pten', 'involved_in', 'pw_pi3k_akt_mtor', { confidence: 0.94, evidenceCount: 200 }),
  edge('p_pten', 'involved_in', 'pw_cell_cycle', { confidence: 0.55, evidenceCount: 35 }),
  edge('p_myc', 'involved_in', 'pw_cell_cycle', { confidence: 0.85, evidenceCount: 150 }),
  edge('p_myc', 'involved_in', 'pw_apoptosis', { confidence: 0.55, evidenceCount: 40 }),
  edge('p_rb1', 'involved_in', 'pw_cell_cycle', { confidence: 0.96, evidenceCount: 210 }),
  edge('p_alk', 'involved_in', 'pw_mapk_erk', { confidence: 0.75, evidenceCount: 80 }),
  edge('p_met', 'involved_in', 'pw_mapk_erk', { confidence: 0.6, evidenceCount: 50 }),
  edge('p_met', 'involved_in', 'pw_vegf', { confidence: 0.55, evidenceCount: 35 }),
  edge('p_pik3ca', 'involved_in', 'pw_pi3k_akt_mtor', { confidence: 0.97, evidenceCount: 240 }),
  edge('p_notch1', 'involved_in', 'pw_notch', { confidence: 0.96, evidenceCount: 180 }),
  edge('p_jak2', 'involved_in', 'pw_jak_stat', { confidence: 0.97, evidenceCount: 200 }),
]

const proteinInteractionEdges = [
  edge('p_brca1', 'interacts_with', 'p_brca2', { confidence: 0.8, evidenceCount: 60 }),
  edge('p_egfr', 'interacts_with', 'p_kras', { confidence: 0.7, evidenceCount: 55 }),
  edge('p_kras', 'interacts_with', 'p_braf', { confidence: 0.9, evidenceCount: 130 }),
  edge('p_braf', 'interacts_with', 'p_pik3ca', { confidence: 0.5, evidenceCount: 25 }),
  edge('p_pten', 'interacts_with', 'p_pik3ca', { confidence: 0.72, evidenceCount: 65 }),
  edge('p_app', 'interacts_with', 'p_psen1', { confidence: 0.88, evidenceCount: 90 }),
  edge('p_apoe', 'interacts_with', 'p_app', { confidence: 0.65, evidenceCount: 50 }),
  edge('p_myc', 'interacts_with', 'p_rb1', { confidence: 0.55, evidenceCount: 30 }),
  edge('p_alk', 'interacts_with', 'p_met', { confidence: 0.4, evidenceCount: 15 }),
  edge('p_cisd1', 'interacts_with', 'p_cisd2', { confidence: 0.6, evidenceCount: 20 }),
  edge('p_notch1', 'interacts_with', 'p_myc', { confidence: 0.5, evidenceCount: 25 }),
]

const compoundTargetEdges = [
  edge('c_erastin', 'targets', 'p_cisd1', { confidence: 0.55, evidenceCount: 18 }),
  edge('c_erastin', 'targets', 'p_cisd2', { confidence: 0.5, evidenceCount: 15 }),
  edge('c_rsl3', 'inhibits', 't_gpx4', { confidence: 0.9, evidenceCount: 45 }),
  edge('c_nutlin3a', 'activates', 'p_tp53', { confidence: 0.85, evidenceCount: 70 }),
  edge('c_prima1', 'activates', 'p_tp53', { confidence: 0.7, evidenceCount: 35 }),
  edge('c_apr246', 'activates', 'p_tp53', { confidence: 0.75, evidenceCount: 40 }),
  edge('c_adavosertib', 'inhibits', 't_wee1', { confidence: 0.92, evidenceCount: 50 }),
  edge('c_plx4720', 'inhibits', 'p_braf', { confidence: 0.9, evidenceCount: 60 }),
  edge('c_gdc0994', 'inhibits', 't_erk', { confidence: 0.85, evidenceCount: 30 }),
  edge('c_ipatasertib', 'inhibits', 't_akt', { confidence: 0.88, evidenceCount: 55 }),
  edge('c_buparlisib', 'inhibits', 'p_pik3ca', { confidence: 0.82, evidenceCount: 48 }),
  edge('c_onalespib', 'inhibits', 't_hsp90', { confidence: 0.78, evidenceCount: 28 }),
  edge('c_ml210', 'inhibits', 't_gpx4', { confidence: 0.85, evidenceCount: 32 }),
  edge('c_fin56', 'inhibits', 't_gpx4', { confidence: 0.75, evidenceCount: 22 }),
  edge('c_deferoxamine', 'affects', 'p_cisd1', { confidence: 0.5, evidenceCount: 14 }),
  edge('c_deferoxamine', 'affects', 'p_cisd2', { confidence: 0.48, evidenceCount: 12 }),
  edge('c_ars853', 'inhibits', 'p_kras', { confidence: 0.8, evidenceCount: 40 }),
  edge('c_mrtx1257', 'inhibits', 'p_kras', { confidence: 0.78, evidenceCount: 33 }),
  edge('c_sch772984', 'inhibits', 't_erk', { confidence: 0.88, evidenceCount: 44 }),
  edge('c_ly3009120', 'inhibits', 'p_braf', { confidence: 0.8, evidenceCount: 36 }),
  edge('c_torin1', 'inhibits', 't_mtor', { confidence: 0.86, evidenceCount: 38 }),
  edge('c_scrambled_probe', 'targets', 'p_cisd3', { confidence: 0.4, evidenceCount: 6 }),
]

const compoundDiseaseEdges = [
  edge('c_nutlin3a', 'tested_for', 'd_colorectal_cancer', { confidence: 0.5, evidenceCount: 16 }),
  edge('c_prima1', 'tested_for', 'd_ovarian_cancer', { confidence: 0.45, evidenceCount: 12 }),
  edge('c_apr246', 'tested_for', 'd_ovarian_cancer', { confidence: 0.6, evidenceCount: 24 }),
  edge('c_adavosertib', 'tested_for', 'd_ovarian_cancer', { confidence: 0.55, evidenceCount: 20 }),
  edge('c_plx4720', 'tested_for', 'd_melanoma', { confidence: 0.65, evidenceCount: 26 }),
  edge('c_ipatasertib', 'tested_for', 'd_breast_cancer', { confidence: 0.62, evidenceCount: 28 }),
  edge('c_buparlisib', 'tested_for', 'd_breast_cancer', { confidence: 0.55, evidenceCount: 22 }),
  edge('c_onalespib', 'tested_for', 'd_nsclc', { confidence: 0.4, evidenceCount: 10 }),
  edge('c_deferoxamine', 'tested_for', 'd_wolfram2', { confidence: 0.35, evidenceCount: 8 }),
  edge('c_ars853', 'tested_for', 'd_colorectal_cancer', { confidence: 0.5, evidenceCount: 14 }),
  edge('c_mrtx1257', 'tested_for', 'd_nsclc', { confidence: 0.52, evidenceCount: 16 }),
  edge('c_erastin', 'tested_for', 'd_glioblastoma', { confidence: 0.4, evidenceCount: 9 }),
  edge('c_rsl3', 'tested_for', 'd_glioblastoma', { confidence: 0.42, evidenceCount: 11 }),
  edge('c_ml210', 'tested_for', 'd_prostate_cancer', { confidence: 0.38, evidenceCount: 7 }),
  edge('c_fin56', 'tested_for', 'd_breast_cancer', { confidence: 0.35, evidenceCount: 6 }),
  edge('c_sch772984', 'tested_for', 'd_melanoma', { confidence: 0.45, evidenceCount: 13 }),
  edge('c_ly3009120', 'tested_for', 'd_colorectal_cancer', { confidence: 0.44, evidenceCount: 12 }),
  edge('c_torin1', 'tested_for', 'd_glioblastoma', { confidence: 0.38, evidenceCount: 8 }),
  edge('c_gdc0994', 'tested_for', 'd_colorectal_cancer', { confidence: 0.4, evidenceCount: 10 }),
]

const compoundDevelopedAsEdges = [
  edge('c_plx4720', 'developed_as', 'dr_vemurafenib', { confidence: 0.95, evidenceCount: 20 }),
]

const drugTargetEdges = [
  edge('dr_vemurafenib', 'inhibits', 'p_braf', { confidence: 0.97, evidenceCount: 220 }),
  edge('dr_dabrafenib', 'inhibits', 'p_braf', { confidence: 0.96, evidenceCount: 190 }),
  edge('dr_trametinib', 'inhibits', 't_mek', { confidence: 0.95, evidenceCount: 170 }),
  edge('dr_osimertinib', 'inhibits', 'p_egfr', { confidence: 0.97, evidenceCount: 240 }),
  edge('dr_erlotinib', 'inhibits', 'p_egfr', { confidence: 0.93, evidenceCount: 210 }),
  edge('dr_olaparib', 'inhibits', 't_parp1', { confidence: 0.96, evidenceCount: 200 }),
  edge('dr_talazoparib', 'inhibits', 't_parp1', { confidence: 0.95, evidenceCount: 150 }),
  edge('dr_imatinib', 'inhibits', 't_bcr_abl', { confidence: 0.98, evidenceCount: 260 }),
  edge('dr_ruxolitinib', 'inhibits', 'p_jak2', { confidence: 0.94, evidenceCount: 160 }),
  edge('dr_donepezil', 'inhibits', 't_ache', { confidence: 0.9, evidenceCount: 130 }),
]

const drugDiseaseEdges = [
  edge('dr_vemurafenib', 'tested_for', 'd_melanoma', { confidence: 0.97, evidenceCount: 180 }),
  edge('dr_dabrafenib', 'tested_for', 'd_melanoma', { confidence: 0.95, evidenceCount: 150 }),
  edge('dr_trametinib', 'tested_for', 'd_melanoma', { confidence: 0.9, evidenceCount: 120 }),
  edge('dr_osimertinib', 'tested_for', 'd_nsclc', { confidence: 0.97, evidenceCount: 260 }),
  edge('dr_erlotinib', 'tested_for', 'd_nsclc', { confidence: 0.9, evidenceCount: 200 }),
  edge('dr_olaparib', 'tested_for', 'd_ovarian_cancer', { confidence: 0.96, evidenceCount: 210 }),
  edge('dr_olaparib', 'tested_for', 'd_breast_cancer', { confidence: 0.85, evidenceCount: 130 }),
  edge('dr_talazoparib', 'tested_for', 'd_breast_cancer', { confidence: 0.92, evidenceCount: 140 }),
  edge('dr_imatinib', 'tested_for', 'd_cml', { confidence: 0.98, evidenceCount: 300 }),
  edge('dr_ruxolitinib', 'tested_for', 'd_polycythemia_vera', { confidence: 0.95, evidenceCount: 170 }),
  edge('dr_donepezil', 'tested_for', 'd_alzheimers', { confidence: 0.88, evidenceCount: 150 }),
]

const publicationMentionEdges = [
  edge('g_tp53', 'mentioned_in', 'pub_1', { confidence: 0.9, evidenceCount: 1 }),
  edge('p_tp53', 'mentioned_in', 'pub_1', { confidence: 0.9, evidenceCount: 1 }),
  edge('g_brca1', 'mentioned_in', 'pub_2', { confidence: 0.9, evidenceCount: 1 }),
  edge('g_brca2', 'mentioned_in', 'pub_2', { confidence: 0.9, evidenceCount: 1 }),
  edge('d_breast_cancer', 'mentioned_in', 'pub_2', { confidence: 0.85, evidenceCount: 1 }),
  edge('g_egfr', 'mentioned_in', 'pub_3', { confidence: 0.9, evidenceCount: 1 }),
  edge('m_egfr_l858r', 'mentioned_in', 'pub_3', { confidence: 0.85, evidenceCount: 1 }),
  edge('m_egfr_t790m', 'mentioned_in', 'pub_3', { confidence: 0.85, evidenceCount: 1 }),
  edge('g_kras', 'mentioned_in', 'pub_4', { confidence: 0.9, evidenceCount: 1 }),
  edge('m_kras_g12c', 'mentioned_in', 'pub_4', { confidence: 0.88, evidenceCount: 1 }),
  edge('g_braf', 'mentioned_in', 'pub_5', { confidence: 0.9, evidenceCount: 1 }),
  edge('dr_vemurafenib', 'mentioned_in', 'pub_5', { confidence: 0.85, evidenceCount: 1 }),
  edge('g_apoe', 'mentioned_in', 'pub_6', { confidence: 0.9, evidenceCount: 1 }),
  edge('d_alzheimers', 'mentioned_in', 'pub_6', { confidence: 0.85, evidenceCount: 1 }),
  edge('g_psen1', 'mentioned_in', 'pub_7', { confidence: 0.9, evidenceCount: 1 }),
  edge('g_cisd2', 'mentioned_in', 'pub_8', { confidence: 0.85, evidenceCount: 1 }),
  edge('d_wolfram2', 'mentioned_in', 'pub_8', { confidence: 0.8, evidenceCount: 1 }),
  edge('g_cisd1', 'mentioned_in', 'pub_9', { confidence: 0.8, evidenceCount: 1 }),
  edge('pw_ferroptosis', 'mentioned_in', 'pub_9', { confidence: 0.75, evidenceCount: 1 }),
  edge('g_pten', 'mentioned_in', 'pub_10', { confidence: 0.9, evidenceCount: 1 }),
  edge('g_myc', 'mentioned_in', 'pub_11', { confidence: 0.9, evidenceCount: 1 }),
  edge('d_dlbcl', 'mentioned_in', 'pub_11', { confidence: 0.8, evidenceCount: 1 }),
  edge('g_rb1', 'mentioned_in', 'pub_12', { confidence: 0.9, evidenceCount: 1 }),
  edge('d_retinoblastoma', 'mentioned_in', 'pub_12', { confidence: 0.85, evidenceCount: 1 }),
  edge('g_alk', 'mentioned_in', 'pub_13', { confidence: 0.9, evidenceCount: 1 }),
  edge('m_alk_eml4', 'mentioned_in', 'pub_13', { confidence: 0.85, evidenceCount: 1 }),
  edge('g_met', 'mentioned_in', 'pub_14', { confidence: 0.85, evidenceCount: 1 }),
  edge('g_pik3ca', 'mentioned_in', 'pub_15', { confidence: 0.9, evidenceCount: 1 }),
  edge('g_notch1', 'mentioned_in', 'pub_16', { confidence: 0.85, evidenceCount: 1 }),
  edge('g_jak2', 'mentioned_in', 'pub_17', { confidence: 0.9, evidenceCount: 1 }),
  edge('m_jak2_v617f', 'mentioned_in', 'pub_17', { confidence: 0.88, evidenceCount: 1 }),
  edge('c_nutlin3a', 'mentioned_in', 'pub_18', { confidence: 0.85, evidenceCount: 1 }),
  edge('p_tp53', 'mentioned_in', 'pub_18', { confidence: 0.8, evidenceCount: 1 }),
  edge('dr_olaparib', 'mentioned_in', 'pub_19', { confidence: 0.9, evidenceCount: 1 }),
  edge('t_parp1', 'mentioned_in', 'pub_19', { confidence: 0.85, evidenceCount: 1 }),
  edge('t_gpx4', 'mentioned_in', 'pub_20', { confidence: 0.85, evidenceCount: 1 }),
  edge('pw_ferroptosis', 'mentioned_in', 'pub_20', { confidence: 0.8, evidenceCount: 1 }),
]

const publicationSupportsEdges = [
  edge('pub_2', 'supports', 'd_breast_cancer', { confidence: 0.85, evidenceCount: 1 }),
  edge('pub_5', 'supports', 'd_melanoma', { confidence: 0.85, evidenceCount: 1 }),
  edge('pub_6', 'supports', 'd_alzheimers', { confidence: 0.85, evidenceCount: 1 }),
  edge('pub_9', 'supports', 'pw_ferroptosis', { confidence: 0.75, evidenceCount: 1 }),
  edge('pub_11', 'supports', 'd_dlbcl', { confidence: 0.8, evidenceCount: 1 }),
  edge('pub_17', 'supports', 'd_polycythemia_vera', { confidence: 0.85, evidenceCount: 1 }),
  edge('pub_19', 'supports', 'd_ovarian_cancer', { confidence: 0.85, evidenceCount: 1 }),
  edge('pub_20', 'supports', 'd_glioblastoma', { confidence: 0.6, evidenceCount: 1 }),
]

const clinicalTrialEdges = [
  edge('dr_vemurafenib', 'evaluated_in', 'ct_1', { confidence: 0.9, evidenceCount: 1 }),
  edge('ct_1', 'tested_for', 'd_melanoma', { confidence: 0.9, evidenceCount: 1 }),
  edge('dr_osimertinib', 'evaluated_in', 'ct_2', { confidence: 0.9, evidenceCount: 1 }),
  edge('ct_2', 'tested_for', 'd_nsclc', { confidence: 0.9, evidenceCount: 1 }),
  edge('dr_olaparib', 'evaluated_in', 'ct_3', { confidence: 0.9, evidenceCount: 1 }),
  edge('ct_3', 'tested_for', 'd_ovarian_cancer', { confidence: 0.9, evidenceCount: 1 }),
  edge('dr_ruxolitinib', 'evaluated_in', 'ct_4', { confidence: 0.9, evidenceCount: 1 }),
  edge('ct_4', 'tested_for', 'd_polycythemia_vera', { confidence: 0.9, evidenceCount: 1 }),
  edge('c_ipatasertib', 'evaluated_in', 'ct_5', { confidence: 0.85, evidenceCount: 1 }),
  edge('ct_5', 'tested_for', 'd_breast_cancer', { confidence: 0.85, evidenceCount: 1 }),
  edge('c_adavosertib', 'evaluated_in', 'ct_6', { confidence: 0.85, evidenceCount: 1 }),
  edge('ct_6', 'tested_for', 'd_ovarian_cancer', { confidence: 0.85, evidenceCount: 1 }),
  edge('c_apr246', 'evaluated_in', 'ct_7', { confidence: 0.85, evidenceCount: 1 }),
  edge('ct_7', 'tested_for', 'd_ovarian_cancer', { confidence: 0.85, evidenceCount: 1 }),
  edge('dr_talazoparib', 'evaluated_in', 'ct_8', { confidence: 0.9, evidenceCount: 1 }),
  edge('ct_8', 'tested_for', 'd_breast_cancer', { confidence: 0.9, evidenceCount: 1 }),
  edge('dr_imatinib', 'evaluated_in', 'ct_9', { confidence: 0.95, evidenceCount: 1 }),
  edge('ct_9', 'tested_for', 'd_cml', { confidence: 0.95, evidenceCount: 1 }),
  edge('dr_donepezil', 'evaluated_in', 'ct_10', { confidence: 0.85, evidenceCount: 1 }),
  edge('ct_10', 'tested_for', 'd_alzheimers', { confidence: 0.85, evidenceCount: 1 }),
]

const pathwayProcessEdges = [
  edge('pw_ddr', 'part_of', 'proc_dna_repair', { confidence: 0.85, evidenceCount: 1 }),
  edge('pw_hrr', 'part_of', 'proc_dna_repair', { confidence: 0.85, evidenceCount: 1 }),
  edge('pw_ferroptosis', 'part_of', 'proc_oxidative_stress', { confidence: 0.75, evidenceCount: 1 }),
  edge('pw_fe_s_homeostasis', 'part_of', 'proc_iron_homeostasis', { confidence: 0.8, evidenceCount: 1 }),
  edge('pw_cell_cycle', 'part_of', 'proc_senescence', { confidence: 0.6, evidenceCount: 1 }),
  edge('pw_apoptosis', 'part_of', 'proc_mito_dysfunction', { confidence: 0.5, evidenceCount: 1 }),
  edge('pw_mapk_erk', 'part_of', 'proc_inflammatory_response', { confidence: 0.45, evidenceCount: 1 }),
  edge('pw_vegf', 'part_of', 'proc_angiogenesis', { confidence: 0.85, evidenceCount: 1 }),
  edge('pw_amyloidogenic', 'part_of', 'proc_mito_dysfunction', { confidence: 0.5, evidenceCount: 1 }),
]

const processDiseaseEdges = [
  edge('proc_oxidative_stress', 'associated_with', 'd_alzheimers', { confidence: 0.7, evidenceCount: 40 }),
  edge('proc_iron_homeostasis', 'associated_with', 'd_wolfram2', { confidence: 0.6, evidenceCount: 20 }),
  edge('proc_angiogenesis', 'associated_with', 'd_glioblastoma', { confidence: 0.75, evidenceCount: 60 }),
  edge('proc_senescence', 'associated_with', 'd_breast_cancer', { confidence: 0.4, evidenceCount: 15 }),
  edge('proc_mito_dysfunction', 'associated_with', 'd_alzheimers', { confidence: 0.72, evidenceCount: 55 }),
  edge('proc_autophagy', 'associated_with', 'd_pancreatic_cancer', { confidence: 0.4, evidenceCount: 18 }),
  edge('proc_inflammatory_response', 'associated_with', 'd_colorectal_cancer', { confidence: 0.55, evidenceCount: 35 }),
]

export const edges: GraphEdge[] = [
  ...encodesEdges,
  ...geneMutationEdges,
  ...proteinDiseaseEdges,
  ...proteinPathwayEdges,
  ...proteinInteractionEdges,
  ...compoundTargetEdges,
  ...compoundDiseaseEdges,
  ...compoundDevelopedAsEdges,
  ...drugTargetEdges,
  ...drugDiseaseEdges,
  ...publicationMentionEdges,
  ...publicationSupportsEdges,
  ...clinicalTrialEdges,
  ...pathwayProcessEdges,
  ...processDiseaseEdges,
]

export const mockDataset: GraphDataset = { nodes, edges }
