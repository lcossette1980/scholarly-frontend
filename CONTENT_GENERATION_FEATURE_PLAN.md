# Content Generation Feature - Implementation Plan
**ScholarlyAI: From Outline to Complete Paper**

---

## 🎯 **Strategic Overview**

### **What This Adds**
Transform ScholarlyAI from a "bibliography tool" into a **complete research writing assistant**:
- Current: Upload papers → Get bibliographies → Generate topics → Create outlines
- **NEW**: Select outline → Generate full content (blog/paper/article) → Download formatted document

### **Why This Works**
1. **Natural progression**: Users already have sources, topics, and outlines
2. **Higher value**: $0.99-$2.99/page vs $9.99/month unlimited bibliographies
3. **Unique moat**: Content generated FROM THEIR OWN SOURCES (not random AI)
4. **Premium tier justification**: Researcher plan becomes essential

---

## 📐 **Token/Page/Word Math (The Foundation)**

### **Standard Conversion**
```
1 page (double-spaced, 12pt Times New Roman, 1" margins)
  = 250 words
  = ~330 tokens (OpenAI: 1 token ≈ 0.75 words)
  = ~1,350 characters

Quick Reference:
  3 pages  = 750 words   ≈ 1,000 tokens
  5 pages  = 1,250 words ≈ 1,650 tokens
  8 pages  = 2,000 words ≈ 2,650 tokens
  12 pages = 3,000 words ≈ 4,000 tokens
  20 pages = 5,000 words ≈ 6,650 tokens
```

### **Billing Formula**
```javascript
// User-facing
page_eq = ceil(words / 250) OR ceil(tokens / 330)

// Backend metering (use tokens for precision)
output_tokens_target = page_eq * 330
input_tokens_est = selected_sources_tokens + template_tokens + outline_tokens

// Cost calculation
cost = (input_tokens / 1M * input_rate) + (output_tokens / 1M * output_rate)
```

---

## 🤖 **Model Selection Strategy**

### **Routing Logic**

| Scenario | Input Tokens | Output Tokens | Model | Why |
|----------|-------------|---------------|-------|-----|
| **Small Job** | < 50k | < 8k | GPT-4o | Cheapest ($0.0025/1k in, $0.01/1k out) |
| **Medium Job** | 50k-120k | 8k-16k | GPT-4.1 | Better output length (32k max) |
| **Large Job** | 120k-500k | 16k-32k | GPT-4.1 1M | Handles massive source packs |
| **Huge Job (Pro)** | 500k-1M | Any | Claude Sonnet 4/4.5 | Best for giant contexts ($3/Mtok in, $15/Mtok out) |

### **Auto-Routing Pseudocode**
```javascript
function selectModel(inputTokens, outputTokensTarget, tier) {
  if (tier === 'pro') {
    if (inputTokens > 500000) return 'claude-sonnet-4-5-1m';
    if (inputTokens > 120000) return 'gpt-4-1-1m';
  }

  // Standard tier
  if (inputTokens > 120000 || outputTokensTarget > 12000) {
    return 'gpt-4-1';
  }
  if (inputTokens > 50000 || outputTokensTarget > 8000) {
    return 'gpt-4-1';
  }
  return 'gpt-4o'; // Cheapest, works for most
}
```

---

## 💰 **Pricing Strategy**

### **Two-Tier System**

#### **Standard Tier** (GPT-4o / GPT-4.1)
- **Blog/Essay**: $0.99/page
- **Journal/Conference Paper**: $1.49/page
- **Max**: 12 pages per generation

**Cost Analysis (8-page paper example):**
```
Input: ~8,000 tokens (10 sources + outline + template)
Output: ~2,650 tokens (8 pages)
Total: ~10,650 tokens

GPT-4o cost:
  Input:  8,000 / 1M * $0.0025 = $0.02
  Output: 2,650 / 1M * $0.01   = $0.026
  Total: ~$0.046

User pays: 8 * $1.49 = $11.92
Margin: $11.87 (99.6%)

GPT-4.1 cost (if needed):
  Input:  8,000 / 1M * $3 = $0.024
  Output: 2,650 / 1M * $12 = $0.032
  Total: ~$0.056
  Margin: $11.86 (99.5%)
```

#### **Pro Tier** (Claude Sonnet 4/4.5 / GPT-4.1 1M)
- **Blog/Essay**: $1.99/page
- **Journal/Conference Paper**: $2.99/page
- **Max**: 20 pages per generation
- **Includes**: Massive source packs (50+ papers), better coherence, longer single-pass output

**Cost Analysis (20-page paper example):**
```
Input: ~150,000 tokens (50 sources + outline + template)
Output: ~6,600 tokens (20 pages)
Total: ~156,600 tokens

Claude Sonnet 4/4.5 cost:
  Input:  150,000 / 1M * $3  = $0.45
  Output: 6,600 / 1M * $15   = $0.099
  Total: ~$0.55

User pays: 20 * $2.99 = $59.80
Margin: $59.25 (99.1%)
```

### **Package Bundles (Optional)**
- **Starter Pack**: 10 pages for $9.99 ($1/page, save $4.90)
- **Student Pack**: 50 pages for $39.99 ($0.80/page, save $34.51)
- **Researcher Pack**: 200 pages for $129.99 ($0.65/page, save $168.01)

### **Subscription Integration**
- **Free Plan**: No content generation
- **Student Plan ($9.99/mo)**: 25% discount on content generation
- **Researcher Plan ($19.99/mo)**: 40% discount + Pro tier access + bulk discounts

---

## 🏗️ **Technical Architecture**

### **1. Firestore Schema**

#### **New Collections:**

**`jobs` (Content Generation Jobs)**
```javascript
{
  id: "job_abc123",
  userId: "uid_xyz",
  type: "journal_paper", // blog, essay, conference_paper, journal_paper
  status: "processing", // estimating, outlining, drafting, formatting, completed, failed

  // Input configuration
  selectedSources: ["source_1", "source_2", ...], // IDs from bibliography_entries
  outlineId: "outline_xyz", // From topic generator

  // Length/format
  lengthMode: "pages", // pages or words
  targetPages: 8,
  targetWords: 2000,
  style: "apa_7", // apa_7, mla_9, chicago_17, ieee, blog
  includeAbstract: true,
  includeTables: false,
  tone: "academic", // academic, professional, conversational

  // Model selection
  tier: "standard", // standard or pro
  model: "gpt-4o",

  // Token estimates
  inputTokensEst: 8500,
  outputTokensTarget: 2650,
  inputTokensActual: null, // Filled after generation
  outputTokensActual: null,

  // Pricing
  pricePerPage: 1.49,
  totalPrice: 11.92,
  costActual: 0.056,
  margin: 11.864,

  // Generation data
  outline: {
    thesis: "...",
    sections: [
      { heading: "Introduction", wordTarget: 400, order: 1 },
      { heading: "Literature Review", wordTarget: 800, order: 2 },
      ...
    ]
  },

  // Generated content
  generated: {
    sections: [
      {
        heading: "Introduction",
        html: "<p>...</p>",
        plain: "...",
        wordCount: 425,
        citations: ["source_1", "source_2"],
        order: 1
      },
      ...
    ],
    abstract: "...",
    references: [...], // Formatted from selected sources
    wordCountTotal: 2043,
    pageCountEst: 8.2
  },

  // Outputs
  renders: {
    docx: "gs://bucket/jobs/job_abc123/output.docx",
    pdf: "gs://bucket/jobs/job_abc123/output.pdf",
    html: "gs://bucket/jobs/job_abc123/output.html"
  },

  // Metadata
  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp,
  error: null
}
```

**`content_credits` (Optional: Credit-based system)**
```javascript
{
  userId: "uid_xyz",
  creditsRemaining: 50, // pages
  tier: "standard",
  purchaseHistory: [
    {
      packageId: "starter_pack",
      pages: 10,
      price: 9.99,
      purchasedAt: timestamp
    }
  ],
  discountRate: 0.25 // From subscription
}
```

### **2. Backend Cloud Functions**

**File: `functions/contentGeneration.js`**

```javascript
// 1. Estimate cost
exports.estimateContentGeneration = functions.https.onCall(async (data, context) => {
  const { sourceIds, outlineId, targetPages, type, tier } = data;

  // Load sources and outline
  const sources = await loadSources(sourceIds);
  const outline = await loadOutline(outlineId);

  // Count tokens
  const inputTokens = countTokens(sources) + countTokens(outline) + TEMPLATE_TOKENS;
  const outputTokens = targetPages * 330;

  // Select model
  const model = selectModel(inputTokens, outputTokens, tier);

  // Calculate cost
  const { modelCost, userPrice } = calculatePricing(
    inputTokens,
    outputTokens,
    model,
    type,
    tier,
    targetPages
  );

  return {
    inputTokens,
    outputTokens,
    model,
    modelCost,
    userPrice,
    pricePerPage: userPrice / targetPages
  };
});

// 2. Generate outline (if needed)
exports.generateDetailedOutline = functions.https.onCall(async (data, context) => {
  const { sourceIds, topic, targetPages, type } = data;

  const sources = await loadSources(sourceIds);
  const wordsPerPage = 250;
  const targetWords = targetPages * wordsPerPage;

  // Calculate section targets
  const sectionAllocation = {
    introduction: 0.15,
    literature_review: 0.35,
    methodology: 0.20,
    results: 0.15,
    discussion: 0.10,
    conclusion: 0.05
  };

  const prompt = `
You are an academic writing assistant. Based on these ${sources.length} annotated bibliography sources, create a detailed outline for a ${targetPages}-page ${type}.

Topic: ${topic}
Target: ${targetWords} words (${targetPages} pages)

Sources:
${sources.map(s => formatSourceForPrompt(s)).join('\n\n')}

Create a structured outline with:
1. Thesis statement
2. Section headings (Introduction, Literature Review, Methodology, etc.)
3. Word target for each section (totaling ${targetWords} words)
4. Key points per section (bullet list)
5. Which sources to cite in each section

Return as JSON.
  `;

  const outline = await callOpenAI(prompt, 'gpt-4o');

  // Save to Firestore
  const outlineRef = await db.collection('outlines').add({
    userId: context.auth.uid,
    topic,
    targetPages,
    type,
    sourceIds,
    outline: JSON.parse(outline),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { outlineId: outlineRef.id, outline: JSON.parse(outline) };
});

// 3. Generate content (main function)
exports.generateContent = functions
  .runWith({ timeoutSeconds: 540, memory: '2GB' })
  .https.onCall(async (data, context) => {
    const { jobId } = data;

    // Load job
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    const job = jobDoc.data();

    await updateJobStatus(jobId, 'outlining');

    // Generate detailed outline (or use existing)
    let outline = job.outline;
    if (!outline) {
      outline = await generateDetailedOutline({
        sourceIds: job.selectedSources,
        topic: job.topic,
        targetPages: job.targetPages,
        type: job.type
      });
      await db.collection('jobs').doc(jobId).update({ outline });
    }

    await updateJobStatus(jobId, 'drafting');

    // Generate sections in batches
    const sections = [];
    for (let i = 0; i < outline.sections.length; i += 2) {
      const batch = outline.sections.slice(i, i + 2);
      const generatedBatch = await generateSectionsBatch(
        batch,
        job.selectedSources,
        job.style,
        job.tone,
        sections // Pass previous sections for context
      );
      sections.push(...generatedBatch);

      // Update progress
      await db.collection('jobs').doc(jobId).update({
        'generated.sections': sections,
        progress: (sections.length / outline.sections.length) * 80 // 0-80% for drafting
      });
    }

    await updateJobStatus(jobId, 'formatting');

    // Generate abstract (if needed)
    let abstract = null;
    if (job.includeAbstract) {
      abstract = await generateAbstract(sections, job.style);
    }

    // Format references
    const references = await formatReferences(job.selectedSources, job.style);

    // Calculate totals
    const wordCountTotal = sections.reduce((sum, s) => sum + s.wordCount, 0);
    const pageCountEst = wordCountTotal / 250;

    // Save generated content
    await db.collection('jobs').doc(jobId).update({
      'generated': {
        sections,
        abstract,
        references,
        wordCountTotal,
        pageCountEst
      },
      progress: 90
    });

    // Render outputs (DOCX, PDF, HTML)
    await updateJobStatus(jobId, 'rendering');
    const renders = await renderOutputs(jobId, sections, abstract, references, job.style);

    await db.collection('jobs').doc(jobId).update({
      renders,
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      progress: 100
    });

    return { jobId, renders };
  });

// 4. Helper: Generate sections in batch
async function generateSectionsBatch(sectionSpecs, sourceIds, style, tone, previousSections) {
  const sources = await loadSources(sourceIds);

  // Build context from previous sections (for coherence)
  const contextSummary = previousSections.length > 0
    ? summarizePreviousSections(previousSections.slice(-2))
    : '';

  const prompt = `
You are an academic writing assistant. Generate the following sections for a ${style} formatted ${tone} paper.

Previously written sections (for context):
${contextSummary}

Sources available:
${sources.map(s => formatSourceForPrompt(s)).join('\n\n')}

Sections to generate:
${sectionSpecs.map(s => `
### ${s.heading}
- Target: ${s.wordTarget} words (±50 words)
- Key points: ${s.keyPoints.join(', ')}
- Sources to cite: ${s.sourcesToCite.join(', ')}
`).join('\n')}

Requirements:
1. Write in clear, ${tone} language appropriate for ${style} style
2. MUST cite sources inline using (Author, Year) format
3. Every claim/quote/paraphrase must have a citation
4. Hit word targets precisely (±3%)
5. Ensure smooth transitions between paragraphs
6. Use proper academic structure (topic sentences, evidence, analysis)
7. Return as JSON array: [{heading, html, plain, wordCount, citations: [sourceIds]}]

Generate now:
  `;

  const response = await callOpenAI(prompt, job.model, {
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response).sections;
}

// 5. Helper: Render to DOCX/PDF/HTML
async function renderOutputs(jobId, sections, abstract, references, style) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

  // Create DOCX
  const doc = new Document({
    styles: getStylesForFormat(style), // APA/MLA/Chicago styles
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1" margins
        }
      },
      children: [
        // Abstract (if exists)
        ...(abstract ? [
          new Paragraph({
            text: 'Abstract',
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({ text: abstract }),
          new Paragraph({ text: '' }) // Spacing
        ] : []),

        // Sections
        ...sections.flatMap(section => [
          new Paragraph({
            text: section.heading,
            heading: HeadingLevel.HEADING_1
          }),
          ...parseHtmlToParagraphs(section.html)
        ]),

        // References
        new Paragraph({
          text: 'References',
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true
        }),
        ...references.map(ref => new Paragraph({
          text: ref,
          hanging: { left: 720, hanging: 720 } // Hanging indent
        }))
      ]
    }]
  });

  // Save to Cloud Storage
  const buffer = await Packer.toBuffer(doc);
  const bucket = admin.storage().bucket();

  const docxPath = `jobs/${jobId}/output.docx`;
  await bucket.file(docxPath).save(buffer);

  // Generate PDF from DOCX (use LibreOffice or PDF service)
  const pdfPath = await convertDocxToPdf(docxPath);

  // Generate HTML
  const htmlPath = await generateHtml(sections, abstract, references, style);

  return {
    docx: `https://storage.googleapis.com/${bucket.name}/${docxPath}`,
    pdf: `https://storage.googleapis.com/${bucket.name}/${pdfPath}`,
    html: `https://storage.googleapis.com/${bucket.name}/${htmlPath}`
  };
}
```

### **3. Frontend Components**

**New Page: `/compose` or `/generate-content`**

**Component Structure:**
```
ContentGenerationPage
├── SourceSelector (select from existing bibliographies)
├── OutlineViewer (show/edit outline)
├── ConfigPanel
│   ├── TypeSelector (blog/essay/paper)
│   ├── LengthSlider (pages or words)
│   ├── StyleSelector (APA/MLA/Chicago)
│   ├── TierToggle (Standard/Pro)
│   └── OptionsPanel (abstract, tables, tone)
├── CostEstimator (live price preview)
├── GenerateButton
├── ProgressTracker (outline → draft → format → render)
└── OutputViewer (preview + download DOCX/PDF/HTML)
```

**Key Component: Content Generation Form**

```jsx
// ContentGenerationPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { functions, db } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';

const ContentGenerationPage = () => {
  const { currentUser } = useAuth();

  // Configuration state
  const [selectedSources, setSelectedSources] = useState([]);
  const [outlineId, setOutlineId] = useState(null);
  const [type, setType] = useState('blog'); // blog, essay, conference_paper, journal_paper
  const [lengthMode, setLengthMode] = useState('pages'); // pages or words
  const [targetPages, setTargetPages] = useState(5);
  const [targetWords, setTargetWords] = useState(1250);
  const [style, setStyle] = useState('apa_7');
  const [tier, setTier] = useState('standard');
  const [includeAbstract, setIncludeAbstract] = useState(false);
  const [tone, setTone] = useState('academic');

  // Pricing state
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generation state
  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);

  // Live conversion between pages/words
  useEffect(() => {
    if (lengthMode === 'pages') {
      setTargetWords(targetPages * 250);
    } else {
      setTargetPages(Math.ceil(targetWords / 250));
    }
  }, [targetPages, targetWords, lengthMode]);

  // Get estimate when config changes
  useEffect(() => {
    if (selectedSources.length > 0 && outlineId) {
      getEstimate();
    }
  }, [selectedSources, outlineId, targetPages, type, tier]);

  const getEstimate = async () => {
    setLoading(true);
    try {
      const estimateFn = httpsCallable(functions, 'estimateContentGeneration');
      const result = await estimateFn({
        sourceIds: selectedSources.map(s => s.id),
        outlineId,
        targetPages,
        type,
        tier
      });
      setEstimate(result.data);
    } catch (error) {
      console.error('Error estimating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    // Create job in Firestore
    const jobRef = await db.collection('jobs').add({
      userId: currentUser.uid,
      type,
      status: 'pending',
      selectedSources: selectedSources.map(s => s.id),
      outlineId,
      lengthMode,
      targetPages,
      targetWords,
      style,
      tier,
      includeAbstract,
      tone,
      pricePerPage: estimate.pricePerPage,
      totalPrice: estimate.userPrice,
      model: estimate.model,
      inputTokensEst: estimate.inputTokens,
      outputTokensTarget: estimate.outputTokens,
      createdAt: new Date()
    });

    setJobId(jobRef.id);

    // Start generation
    const generateFn = httpsCallable(functions, 'generateContent', {
      timeout: 540000 // 9 minutes
    });

    await generateFn({ jobId: jobRef.id });
  };

  // Listen to job progress
  useEffect(() => {
    if (!jobId) return;

    const unsubscribe = db.collection('jobs').doc(jobId).onSnapshot(doc => {
      const data = doc.data();
      setProgress(data.progress || 0);
      setStatus(data.status);
    });

    return () => unsubscribe();
  }, [jobId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Generate Content</h1>

      {/* Source Selector */}
      <SourceSelector
        selected={selectedSources}
        onChange={setSelectedSources}
      />

      {/* Configuration Panel */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h3 className="font-bold mb-4">Content Type</h3>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="blog">Blog Post</option>
            <option value="essay">Essay</option>
            <option value="conference_paper">Conference Paper</option>
            <option value="journal_paper">Journal Article</option>
          </select>
        </div>

        <div className="card">
          <h3 className="font-bold mb-4">Length</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLengthMode('pages')}
              className={lengthMode === 'pages' ? 'btn-primary' : 'btn-outline'}
            >
              Pages
            </button>
            <button
              onClick={() => setLengthMode('words')}
              className={lengthMode === 'words' ? 'btn-primary' : 'btn-outline'}
            >
              Words
            </button>
          </div>

          <div className="mt-4">
            {lengthMode === 'pages' ? (
              <>
                <input
                  type="range"
                  min="1"
                  max={tier === 'pro' ? 20 : 12}
                  value={targetPages}
                  onChange={(e) => setTargetPages(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2">
                  <span className="text-3xl font-bold">{targetPages}</span> pages
                  <span className="text-sm text-gray-600 block">
                    ≈ {targetWords} words ≈ {Math.round(targetPages * 330)} tokens
                  </span>
                </div>
              </>
            ) : (
              <>
                <input
                  type="number"
                  value={targetWords}
                  onChange={(e) => setTargetWords(parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                  step="250"
                />
                <div className="text-sm text-gray-600 mt-2">
                  ≈ {targetPages} pages ≈ {Math.round(targetWords / 0.75)} tokens
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold mb-4">Citation Style</h3>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="apa_7">APA 7th Edition</option>
            <option value="mla_9">MLA 9th Edition</option>
            <option value="chicago_17">Chicago 17th Edition</option>
            <option value="ieee">IEEE</option>
            <option value="blog">Blog (No formal citations)</option>
          </select>
        </div>

        <div className="card">
          <h3 className="font-bold mb-4">Model Tier</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={tier === 'standard'}
                onChange={() => setTier('standard')}
                className="mr-2"
              />
              <div>
                <div className="font-semibold">Standard</div>
                <div className="text-sm text-gray-600">
                  GPT-4o/4.1 • Up to 12 pages • $0.99-$1.49/page
                </div>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={tier === 'pro'}
                onChange={() => setTier('pro')}
                className="mr-2"
              />
              <div>
                <div className="font-semibold">Pro</div>
                <div className="text-sm text-gray-600">
                  Claude Sonnet 4/4.5 • Up to 20 pages • $1.99-$2.99/page
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Cost Estimate */}
      {estimate && (
        <div className="card mt-6 bg-green-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Estimated Cost</h3>
              <div className="text-sm text-gray-600">
                Model: {estimate.model} • {estimate.inputTokens.toLocaleString()} input tokens • {estimate.outputTokens.toLocaleString()} output tokens
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-700">
                ${estimate.userPrice.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                ${estimate.pricePerPage.toFixed(2)}/page
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleGenerate}
          disabled={!estimate || selectedSources.length === 0 || loading}
          className="btn btn-primary text-lg px-12 py-4"
        >
          {loading ? 'Estimating...' : `Generate Content - $${estimate?.userPrice.toFixed(2) || '0.00'}`}
        </button>
      </div>

      {/* Progress Tracker */}
      {jobId && (
        <ProgressTracker
          status={status}
          progress={progress}
          jobId={jobId}
        />
      )}
    </div>
  );
};
```

---

## 🎨 **UX Flow (User Journey)**

### **Step 1: Access**
```
Dashboard → "Generate Content" button (NEW)
  OR
Topic Generator → Select outline → "Generate Full Paper" button
```

### **Step 2: Configuration**
```
1. Select sources (from existing bibliographies)
   → Shows: 15 sources selected • ~45,000 tokens

2. Choose type
   → Blog Post | Essay | Conference Paper | Journal Article

3. Set length
   → Slider: 1-20 pages (or input words)
   → Live conversion: 8 pages = 2,000 words ≈ 2,650 tokens

4. Pick style
   → APA 7 | MLA 9 | Chicago 17 | IEEE | Blog

5. Select tier
   → Standard ($0.99-$1.49/page) | Pro ($1.99-$2.99/page)

6. Options
   → ☑ Include abstract
   → ☐ Include tables/figures
   → Tone: Academic | Professional | Conversational
```

### **Step 3: Estimate & Confirm**
```
Cost Preview:
┌─────────────────────────────────┐
│ 8 pages @ $1.49/page            │
│                                  │
│ Total: $11.92                    │
│                                  │
│ Model: GPT-4o                    │
│ Input: 8,500 tokens              │
│ Output: 2,650 tokens             │
│                                  │
│ [Generate Content →]             │
└─────────────────────────────────┘
```

### **Step 4: Generation (Real-time Progress)**
```
Progress Bar:
[████████████████░░░░] 80%

✓ Outline created (3s)
✓ Introduction drafted (25s)
✓ Literature Review drafted (45s)
⏳ Methodology drafting... (30s)
⏹ Results pending
⏹ Discussion pending
⏹ Conclusion pending
⏹ Formatting pending
```

### **Step 5: Review & Download**
```
Preview:
┌─────────────────────────────────┐
│ [Abstract] [Introduction] [Lit  │
│  Review] [Methodology] ...       │
│                                  │
│ Statistics:                      │
│ • 2,043 words (8.2 pages)        │
│ • 15 sources cited               │
│ • 47 in-text citations           │
│ • Formatted in APA 7             │
│                                  │
│ [Download DOCX] [Download PDF]   │
│ [View HTML] [Edit & Regenerate]  │
└─────────────────────────────────┘
```

---

## 📍 **Integration Points**

### **Where to Add in Current App**

#### **1. Navigation**
Add to main nav (when logged in):
```jsx
<Link to="/compose" className="nav-link">
  <FileText className="w-5 h-5" />
  Generate Content
  <span className="badge-new">NEW</span>
</Link>
```

#### **2. Topic Generator → Generate Button**
In `TopicGeneratorPage.js`, add button after outline is created:
```jsx
{outline && (
  <button
    onClick={() => navigate('/compose', { state: { outlineId: outline.id } })}
    className="btn btn-primary"
  >
    Generate Full Paper from This Outline →
  </button>
)}
```

#### **3. Dashboard Card**
Add new card to Dashboard:
```jsx
<div className="card">
  <Sparkles className="w-12 h-12 text-chestnut mb-4" />
  <h3 className="text-xl font-bold mb-2">Generate Content</h3>
  <p className="text-gray-600 mb-4">
    Turn your outlines into complete papers, essays, or blog posts
  </p>
  <Link to="/compose" className="btn btn-primary">
    Get Started →
  </Link>
</div>
```

#### **4. Pricing Page**
Add new section:
```jsx
<section className="py-16 bg-gradient-to-br from-purple-50 to-white">
  <h2 className="text-4xl font-bold text-center mb-4">
    Content Generation
  </h2>
  <p className="text-center text-gray-600 mb-12">
    Pay per page for AI-generated content from YOUR sources
  </p>

  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    {/* Standard Tier */}
    <div className="card">
      <h3 className="text-2xl font-bold mb-4">Standard</h3>
      <div className="text-4xl font-bold mb-4">
        $0.99<span className="text-lg text-gray-600">/page</span>
      </div>
      <ul className="space-y-2 mb-6">
        <li>✓ GPT-4o/4.1 powered</li>
        <li>✓ Up to 12 pages</li>
        <li>✓ APA/MLA/Chicago/IEEE</li>
        <li>✓ Export to DOCX/PDF</li>
      </ul>
      <Link to="/compose" className="btn btn-outline w-full">
        Try Standard
      </Link>
    </div>

    {/* Pro Tier */}
    <div className="card border-2 border-chestnut">
      <div className="badge-pro">BEST FOR RESEARCH</div>
      <h3 className="text-2xl font-bold mb-4">Pro</h3>
      <div className="text-4xl font-bold mb-4">
        $1.99<span className="text-lg text-gray-600">/page</span>
      </div>
      <ul className="space-y-2 mb-6">
        <li>✓ Claude Sonnet 4/4.5</li>
        <li>✓ Up to 20 pages</li>
        <li>✓ 50+ source handling</li>
        <li>✓ Better coherence</li>
        <li>✓ Longer single-pass output</li>
      </ul>
      <Link to="/compose?tier=pro" className="btn btn-primary w-full">
        Try Pro
      </Link>
    </div>
  </div>

  {/* Discount for subscribers */}
  <div className="text-center mt-8">
    <p className="text-gray-600">
      Student Plan subscribers: <strong>25% off</strong> •
      Researcher Plan subscribers: <strong>40% off</strong>
    </p>
  </div>
</section>
```

---

## 🛡️ **Quality Controls & Guardrails**

### **1. Length Enforcement**
```javascript
// In section generation prompt
"Target: ${wordTarget} words (STRICT: must be within ±3%, or ${wordTarget * 0.97}-${wordTarget * 1.03} words)"

// Post-generation check
if (actualWords < wordTarget * 0.95) {
  // Expand with "Additionally,..." paragraphs
}
if (actualWords > wordTarget * 1.05) {
  // Trim verbose sentences
}
```

### **2. Citation Discipline**
```javascript
// Validation after each section
function validateCitations(section, sources) {
  const inTextCitations = extractCitations(section.html);
  const unmatchedCitations = inTextCitations.filter(
    cite => !sources.some(s => matchesCitation(s, cite))
  );

  if (unmatchedCitations.length > 0) {
    throw new Error(`Hallucinated citations detected: ${unmatchedCitations.join(', ')}`);
  }

  // Check for uncited paragraphs (in academic papers)
  if (style !== 'blog') {
    const paragraphs = section.html.split('</p>');
    const uncitedParagraphs = paragraphs.filter(p => !containsCitation(p));

    if (uncitedParagraphs.length > paragraphs.length * 0.3) {
      console.warn('Many paragraphs lack citations - may need revision');
    }
  }
}
```

### **3. Originality Check**
```javascript
// After generation, run similarity check
async function checkOriginality(content) {
  // Use Turnitin API or similar
  const similarityReport = await turnitin.check(content);

  return {
    overallSimilarity: similarityReport.percentage,
    matchedSources: similarityReport.matches,
    flaggedPassages: similarityReport.passages.filter(p => p.similarity > 0.15)
  };
}

// Show to user
if (originalityCheck.overallSimilarity > 0.25) {
  showWarning("High similarity detected. Review flagged passages.");
}
```

### **4. Style Compliance**
```javascript
// APA 7 example checks
function validateAPACompliance(document) {
  const issues = [];

  // Heading levels
  if (hasSkippedHeadingLevels(document)) {
    issues.push("Heading levels skip (e.g., H1 → H3)");
  }

  // In-text citations format
  const citations = extractCitations(document);
  citations.forEach(cite => {
    if (!matchesAPAFormat(cite)) {
      issues.push(`Invalid APA citation format: ${cite}`);
    }
  });

  // References format
  const refs = document.references;
  refs.forEach(ref => {
    if (!hasHangingIndent(ref) || !hasProperOrder(ref)) {
      issues.push(`Reference formatting issue: ${ref.slice(0, 50)}...`);
    }
  });

  return issues;
}
```

---

## 💳 **Payment Integration**

### **Option 1: Stripe Direct Charge (One-Time)**
```javascript
// When user clicks "Generate Content"
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(estimate.userPrice * 100), // cents
  currency: 'usd',
  metadata: {
    userId: currentUser.uid,
    jobId: job.id,
    type: 'content_generation',
    pages: job.targetPages
  },
  description: `Generate ${job.targetPages}-page ${job.type}`
});

// After payment success
await db.collection('jobs').doc(jobId).update({
  paymentStatus: 'paid',
  paymentIntentId: paymentIntent.id,
  status: 'processing'
});

// Start generation
```

### **Option 2: Credit System**
```javascript
// User purchases credit pack
const creditPacks = {
  starter: { pages: 10, price: 9.99 },
  student: { pages: 50, price: 39.99 },
  researcher: { pages: 200, price: 129.99 }
};

// On purchase
await db.collection('content_credits').doc(userId).set({
  creditsRemaining: creditsRemaining + pack.pages,
  purchaseHistory: arrayUnion({
    packageId: pack.id,
    pages: pack.pages,
    price: pack.price,
    purchasedAt: new Date()
  })
}, { merge: true });

// On generation
const credits = await getCredits(userId);
if (credits < job.targetPages) {
  throw new Error('Insufficient credits');
}

await db.collection('content_credits').doc(userId).update({
  creditsRemaining: credits - job.targetPages
});
```

### **Option 3: Subscription Add-On**
```javascript
// Subscriber discounts
function calculatePrice(basePrice, userSubscription) {
  const discounts = {
    free: 0,
    trial: 0,
    student: 0.25, // 25% off
    researcher: 0.40 // 40% off
  };

  const discount = discounts[userSubscription.plan] || 0;
  return basePrice * (1 - discount);
}

// Example: Student plan user generating 8 pages
// Standard tier: $1.49/page
// Discounted: $1.49 * 0.75 = $1.12/page
// Total: 8 * $1.12 = $8.96 (vs $11.92 regular)
```

---

## 📊 **Analytics & Metrics to Track**

### **Key Metrics Dashboard**

```javascript
// Track in Firebase Analytics
analytics.logEvent('content_generation_started', {
  type: job.type,
  pages: job.targetPages,
  tier: job.tier,
  sources_count: job.selectedSources.length,
  estimated_price: job.totalPrice
});

analytics.logEvent('content_generation_completed', {
  job_id: job.id,
  duration_seconds: (completedAt - createdAt) / 1000,
  actual_pages: job.generated.pageCountEst,
  actual_words: job.generated.wordCountTotal,
  actual_cost: job.costActual,
  margin: job.margin,
  model: job.model
});

// Monitor:
// 1. Conversion funnel
//    - Started config → Got estimate → Paid → Completed
// 2. Average job value ($/generation)
// 3. Page distribution (most common: 5-8 pages?)
// 4. Model routing (% on each model)
// 5. Refund reasons
// 6. Generation time by page count
// 7. User satisfaction (post-generation survey)
```

---

## 🚀 **Go-to-Market Strategy**

### **Phase 1: Soft Launch (Week 1-2)**
- Enable for Researcher plan subscribers only
- Test with 20-30 early adopters
- Collect feedback on quality, pricing, UX
- Fix bugs, tune prompts

### **Phase 2: Beta Launch (Week 3-4)**
- Open to Student plan subscribers
- Add discount badges ("40% off for subscribers!")
- Email campaign to existing users
- Social proof: "50+ papers generated"

### **Phase 3: Public Launch (Week 5+)**
- Full public release
- Blog post: "Introducing Content Generation"
- Reddit/LinkedIn/Twitter announcements
- PR push: "First bibliography tool that generates full papers from YOUR sources"

### **Marketing Angles**

**Homepage Banner:**
```
🎉 NEW: Generate Full Papers from Your Bibliographies
Turn your research into complete, citation-filled documents in minutes.
[Try Free Estimate →]
```

**Email to Existing Users:**
```
Subject: You asked for it: Full paper generation is here

Hi [Name],

Remember those outlines you created with ScholarlyAI?

Now you can turn them into complete papers.

Upload sources → Generate outline → Generate full content → Download DOCX

Pricing: $0.99-$2.99/page (subscribers get 25-40% off)

[Generate Your First Paper →]
```

**Social Media Post:**
```
Other AI tools: "We'll write your paper!"
Reality: Generic content with hallucinated citations

ScholarlyAI: "We'll write your paper FROM YOUR OWN SOURCES"
Reality: Every claim cited. Every reference real. Every outline YOUR research.

Try it: scholarlyaiapp.com/compose
```

---

## 🔒 **Risk Mitigation**

### **Academic Integrity**
**Problem:** Students using this to "cheat"
**Mitigation:**
1. Watermark outputs: "Generated with AI assistance - Review required"
2. Encourage editing: "This is a draft. You MUST review and customize."
3. Similarity checker built-in
4. Terms of Service: "For research assistance only. Not for submitting as-is."

### **Quality Issues**
**Problem:** Generated content isn't good enough
**Mitigation:**
1. "Edit & Regenerate" button (free re-do within 24 hours)
2. Section-by-section approval (user can reject/regenerate sections)
3. Style guide enforcement (temperature 0.3, strict prompts)
4. Money-back guarantee if <90% of target word count

### **Cost Overruns**
**Problem:** User requests 20 pages, costs explode
**Mitigation:**
1. Hard caps: Standard = 12 pages max, Pro = 20 pages max
2. Pre-charge (Stripe payment intent before generation)
3. Cost preview with "worst case" estimate
4. Cached prompts to reduce input token costs

### **Hallucinated Citations**
**Problem:** AI invents sources
**Mitigation:**
1. ONLY cite from user's selected sources (validate with source IDs)
2. Post-generation citation check (match every citation to a real source)
3. Reject sections with unmatched citations, regenerate
4. Show citation coverage map: "Section 2: 5 sources cited, 0 issues"

---

## ✅ **Launch Checklist**

### **Backend (Cloud Functions)**
- [ ] `/estimateContentGeneration` endpoint
- [ ] `/generateDetailedOutline` endpoint
- [ ] `/generateContent` main function
- [ ] Section generation with citation validation
- [ ] DOCX/PDF rendering (use `docx` npm package)
- [ ] Token counting (OpenAI/Anthropic tokenizers)
- [ ] Model routing logic
- [ ] Stripe payment integration
- [ ] Job status tracking (Firestore listeners)

### **Frontend (React)**
- [ ] `/compose` page
- [ ] Source selector component
- [ ] Outline viewer/editor
- [ ] Configuration panel (type, length, style, tier)
- [ ] Cost estimator (live updates)
- [ ] Progress tracker (real-time job status)
- [ ] Output viewer (preview + download)
- [ ] Payment flow (Stripe checkout)
- [ ] Credit management (if using credit system)

### **Firestore**
- [ ] `jobs` collection schema
- [ ] `content_credits` collection (optional)
- [ ] Security rules (users can only access their jobs)
- [ ] Indexes for queries (userId + createdAt)

### **Pricing & Business**
- [ ] Stripe product/price IDs created
- [ ] Pricing tiers documented
- [ ] Subscription discount logic
- [ ] Refund policy
- [ ] Terms of Service update (AI generation clause)

### **Quality Assurance**
- [ ] Test: 3-page blog (Standard tier)
- [ ] Test: 8-page APA paper (Standard tier)
- [ ] Test: 15-page journal article (Pro tier)
- [ ] Test: Citation validation catches hallucinations
- [ ] Test: Word count hits target ±3%
- [ ] Test: DOCX formatting (margins, spacing, fonts)
- [ ] Test: PDF generation works
- [ ] Test: Payment flow end-to-end
- [ ] Test: Refund process

### **Documentation**
- [ ] User guide: "How to generate content"
- [ ] FAQ: "Is this plagiarism?"
- [ ] Pricing page update
- [ ] Blog post: Feature announcement
- [ ] Help article: "Understanding page-equivalents"

### **Marketing**
- [ ] Homepage banner
- [ ] Email to existing users
- [ ] Social media posts (Twitter, LinkedIn, Reddit)
- [ ] Product Hunt launch (optional)
- [ ] Academic influencer outreach

---

## 🎯 **Success Criteria (30 Days)**

**Metrics to Hit:**
- [ ] 50+ content generations completed
- [ ] Average job value: $12-$15
- [ ] User satisfaction: 4.5/5 or higher
- [ ] Refund rate: <5%
- [ ] Average margin: >95%
- [ ] Generation success rate: >90%
- [ ] Subscriber conversion lift: +15%

**Revenue Projection (Conservative):**
```
Assumptions:
- 1,000 existing users
- 5% try content generation = 50 users
- Average 2 generations/user = 100 generations
- Average 8 pages @ $1.25/page (mixed tiers) = $10/generation

Month 1: 100 × $10 = $1,000
Month 3: 300 × $10 = $3,000
Month 6: 600 × $10 = $6,000

Annual (steady state): ~$50-75k additional revenue
```

---

## 🔮 **Future Enhancements**

### **Phase 2 Features**
1. **Collaborative Editing**: Share drafts with co-authors
2. **Version Control**: Track revisions, compare versions
3. **Tables/Figures Generator**: Create charts from data
4. **Speaker Notes**: Generate presentation notes from papers
5. **Translation**: Output in multiple languages
6. **Voice Narration**: Text-to-speech for accessibility

### **Phase 3: Enterprise**
1. **University Licenses**: Bulk pricing for institutions
2. **LMS Integration**: Canvas, Blackboard, Moodle plugins
3. **Plagiarism API**: Integrate with Turnitin, iThenticate
4. **Citation Manager Sync**: Zotero, Mendeley imports
5. **White-Label**: Universities can brand it

---

## 📝 **Example Prompt Templates**

### **Outline Generation Prompt**
```
You are an expert academic writing assistant specializing in ${type} writing.

Task: Create a detailed outline for a ${targetPages}-page ${type} based on these ${sources.length} annotated bibliography sources.

Topic: ${topic}
Target Length: ${targetWords} words (${targetPages} pages)
Citation Style: ${style}
Tone: ${tone}

Sources:
${sources.map((s, i) => `
[${i+1}] ${s.citation.formatted}
Summary: ${s.summary}
Key Findings: ${s.keyFindings.join(', ')}
`).join('\n\n')}

Requirements:
1. Create a thesis statement that synthesizes findings from these sources
2. Divide content into ${sectionCount} logical sections with headings
3. Allocate word targets to each section (totaling ${targetWords} words)
4. For each section:
   - List 3-5 key points to cover
   - Specify which sources (by number) support each point
   - Suggest 1-2 specific quotes to include
5. Ensure all ${sources.length} sources are cited at least once
6. Follow ${style} structure conventions

Return as JSON:
{
  "thesis": "...",
  "sections": [
    {
      "heading": "Introduction",
      "order": 1,
      "wordTarget": 400,
      "keyPoints": ["...", "..."],
      "sourcesToCite": [1, 3, 5],
      "suggestedQuotes": ["...", "..."]
    },
    ...
  ]
}
```

### **Section Generation Prompt**
```
You are generating Section ${sectionNum} of a ${targetPages}-page ${type}.

Overall Context:
Thesis: ${thesis}
Previous sections summary: ${previousSectionsSummary}

This Section:
Heading: ${section.heading}
Word Target: ${section.wordTarget} words (STRICT: must be ${section.wordTarget * 0.97}-${section.wordTarget * 1.03} words)
Key Points: ${section.keyPoints.join(', ')}

Sources to Cite:
${sourcesToCite.map(s => `
[${s.id}] ${s.citation.formatted}
Summary: ${s.summary}
Key Findings: ${s.keyFindings.join(', ')}
Relevant Quotes: ${s.quotes.slice(0, 2).map(q => `"${q.text}" (p. ${q.page})`).join(', ')}
`).join('\n\n')}

Requirements:
1. Write ${section.wordTarget} words (±3%)
2. Use clear ${tone} language appropriate for ${style} style
3. Every paragraph with a claim/quote/paraphrase MUST cite a source using (Author, Year) format
4. Only cite sources provided above - DO NOT invent citations
5. Start with a strong topic sentence
6. Use transitions to connect to previous section
7. Include 1-2 direct quotes with page numbers
8. End with a sentence that flows into the next section

Return as JSON:
{
  "heading": "${section.heading}",
  "html": "<p>...</p><p>...</p>",
  "plain": "...",
  "wordCount": 405,
  "citations": ["source_1", "source_3", "source_5"],
  "quotes": [
    {"sourceId": "source_1", "text": "...", "page": 42}
  ]
}
```

---

## 🎬 **Ready to Build?**

**Immediate Next Steps:**
1. **This Week**: Set up Firestore schema + basic `/compose` page
2. **Week 2**: Implement estimate endpoint + token counting
3. **Week 3**: Build section generation logic + DOCX rendering
4. **Week 4**: Add payment flow + testing
5. **Week 5**: Soft launch to Researcher plan users

**I can help you:**
- Draft the Cloud Functions code
- Create the React components
- Set up Stripe integration
- Write the generation prompts
- Design the pricing page

**What do you want to tackle first?**
