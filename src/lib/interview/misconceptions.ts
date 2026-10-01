/**
 * Common wrong statements for specific questions.
 *
 * Keyword checks alone would give credit to an answer that uses the right
 * words in the wrong way ("var is block scoped"). These patterns catch the
 * classic mistakes interviewers listen for. They run per sentence on
 * lowercased text with punctuation removed.
 *
 * A pattern is a subject, then a claim later in the same sentence, with no
 * negation or competing subject in between. Sentences that describe a myth
 * ("people often think...") are skipped.
 */

export type Misconception = { label: string; test: RegExp };

const NEGATIONS = ['not', 'never', 'isnt', 'arent', 'cannot', 'cant', 'doesnt', 'dont', 'wont', 'unlike', 'instead', 'but', 'whereas', 'while', 'rather'];

function esc(list: string): string {
  return list
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
    .join('|');
}

/**
 * subject ... claim, within `gap` characters, with none of the blockers (or a
 * negation) in between.
 */
function claim(subject: string, statement: string, blockers = '', gap = 60): RegExp {
  const stop = esc([blockers, NEGATIONS.join('|')].filter(Boolean).join('|'));
  return new RegExp(`\\b(?:${esc(subject)})\\b(?:(?!\\b(?:${stop})\\b).){0,${gap}}?\\b(?:${esc(statement)})\\b`);
}

export const MYTH_MARKERS = /\b(people (often |sometimes )?(think|assume|believe)|myth|misconception|common mistake|wrongly|incorrectly|not true|it is wrong|its wrong|a mistake to think)\b/;

export const MISCONCEPTIONS: Record<string, Misconception[]> = {
  'fe-var-let-const': [
    { label: 'var is function scoped, not block scoped.', test: claim('var', 'block scoped|block scope', 'let|const') },
    { label: 'let and const are block scoped, not function scoped.', test: claim('let|const', 'function scoped|function scope', 'var') },
    { label: 'A const binding cannot be reassigned.', test: claim('const', 'can be reassigned|can reassign|you can reassign|can change the value|is the same as let', 'object|array|property|properties|let|var|mutate|mutated|mutable') },
    { label: 'const does not make an object immutable; its properties can still change.', test: claim('const', 'makes the object immutable|object is immutable|objects are immutable|cannot change its properties|deep freeze') },
    { label: 'var is the older way to declare variables, not the newest.', test: claim('var', 'newest|most modern|recommended way|best practice', 'let|const|avoid') },
  ],
  'fe-useeffect': [
    { label: 'useEffect runs after render, not before it.', test: claim('useeffect|effect|it', 'runs before render|runs before the render|before the component renders|before rendering|before paint') },
    { label: 'An empty dependency array runs the effect once after mount, not on every render.', test: claim('empty array|empty dependency array|empty dependencies', 'every render|each render|on every update|every time') },
    { label: 'With no dependency array the effect runs after every render, not once.', test: claim('no dependency array|without a dependency array|without dependencies|no array', 'runs once|only once|one time') },
  ],
  'be-indexing': [
    { label: 'Indexes slow down writes, because every insert and update must also update the index.', test: claim('index|indexes|indices', 'speed up writes|faster writes|make writes faster|speeds up inserts|faster inserts', 'reads|queries|select') },
    { label: 'More indexes are not always better; each one costs storage and write time.', test: claim('more indexes|adding indexes|index every column|indexing every column', 'always better|always faster|no downside|no cost|always good') },
  ],
  'be-idempotency': [
    { label: 'POST is not idempotent by default; repeating it can create duplicates.', test: claim('post', 'is idempotent|are idempotent|always idempotent', 'put|patch|delete|get|key') },
    { label: 'PUT is idempotent: sending the same PUT twice leaves the same result.', test: claim('put', 'is not idempotent|isnt idempotent|not idempotent', 'post|patch|get|delete') },
  ],
  'be-acid': [
    { label: 'In ACID, the A stands for atomicity, not availability.', test: claim('a stands for|atomicity means|the a in acid|a is', 'availability|asynchronous') },
  ],
  'sd-process-thread': [
    { label: 'Threads in a process share memory; processes have separate memory.', test: claim('threads', 'have separate memory|own memory space|do not share memory|separate address space|isolated memory', 'process|processes') },
    { label: 'Processes do not share memory by default; threads do.', test: claim('processes', 'share memory|share the same memory|same address space', 'thread|threads') },
  ],
  'sd-big-o': [
    { label: 'Looking up a key in a hash map is O(1) on average, not O(n).', test: claim('hash map|hashmap|hash table|dictionary|map lookup', 'o n|linear time|o log n', 'array|list|worst|collision') },
    { label: 'Searching an unsorted array is O(n), not O(1).', test: claim('array|list', 'o 1|constant time', 'index|hash|map|access') },
  ],
  'sd-git-rebase': [
    { label: 'Merge keeps history; rebase is the one that rewrites commits.', test: claim('merge|merging', 'rewrites history|rewrite history|rewrites commits|changes the commit history', 'rebase') },
    { label: 'Rebase does not create a merge commit; it replays your commits.', test: claim('rebase|rebasing', 'creates a merge commit|adds a merge commit|makes a merge commit', 'merge|merging') },
    { label: 'Rebasing a shared branch is risky because it rewrites commits others have pulled.', test: claim('rebase|rebasing', 'shared branch is fine|safe on shared|always safe|public branch is fine') },
  ],
  'qa-severity-priority': [
    { label: 'Severity and priority are different: severity is impact, priority is urgency.', test: /\bseverity and priority (are|mean) (the same|basically the same|identical|the same thing)\b/ },
  ],
  'ar-cap': [
    { label: 'During a network partition you cannot have both full consistency and full availability.', test: claim('you|we|system|systems|database|databases', 'have all three|get all three|guarantee all three|achieve all three') },
  ],
  'do-k8s-basics': [
    { label: 'A Service gives Pods a stable address; it does not run containers.', test: claim('service|services', 'runs the containers|runs containers|is a container|creates the containers', 'pod|pods|deployment') },
  ],
  'da-joins': [
    { label: 'A LEFT JOIN keeps every row from the left table, not only matching rows.', test: claim('left join', 'only matching|only the matching|only rows that match|only returns rows that match', 'inner') },
    { label: 'An INNER JOIN returns only matching rows, not all rows.', test: claim('inner join', 'all rows|every row|keeps all|returns all', 'left|right|outer|match') },
  ],
  'ds-bias-variance': [
    { label: 'High bias means underfitting, not overfitting.', test: claim('high bias', 'overfit|overfitting|overfits', 'variance') },
    { label: 'High variance means overfitting, not underfitting.', test: claim('high variance', 'underfit|underfitting|underfits', 'bias') },
  ],
  'ds-imbalanced': [
    { label: 'Accuracy is misleading on imbalanced data; predicting no fraud every time scores 99.5 percent.', test: claim('accuracy', 'is a good metric|is the best metric|is the right metric|is fine here|works well here|is enough') },
  ],
  'ds-precision-recall': [
    { label: 'Recall is about false negatives (missed positives), not false positives.', test: claim('recall', 'false positives|false alarms', 'precision|negative') },
    { label: 'Precision is about false positives, not missed positives.', test: claim('precision', 'false negatives|missed positives|how many we caught|how many positives we found', 'recall') },
  ],
  'ds-ab-significance': [
    { label: 'Stopping a test the moment it looks significant (peeking) inflates false positives.', test: claim('stop|end|ship', 'as soon as it is significant|as soon as it becomes significant|once it hits significance|the moment it is significant|when p goes below') },
  ],
};
