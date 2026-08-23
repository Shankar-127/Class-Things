/*
 * Static source catalog for the GitHub Pages site.
 * Asset links intentionally stay relative to this repository root.
 */
(function () {
  'use strict';

  const subjects = [
    { name: 'CM LAB', fileCount: 0 },
    { name: 'DAA', fileCount: 2 },
    { name: 'DBMS', fileCount: 0 },
    { name: 'DBMS LAB', fileCount: 0 },
    { name: 'DEV LAB', fileCount: 0 },
    { name: 'I & E', fileCount: 2 },
    { name: 'JAVA', fileCount: 1 },
    { name: 'JAVA LAB', fileCount: 4 },
    { name: 'SDE', fileCount: 2 },
    { name: 'SDT', fileCount: 5 }
  ];

  const resources = [
    {
      id: 'JAVA LAB/JLP5.pdf',
      subject: 'JAVA LAB',
      filename: 'JLP5.pdf',
      title: 'Java Lab Program 5',
      type: 'PDF',
      category: 'Lab program',
      unit: 'Lab 5',
      summary: 'Exception handling and custom exception practice.',
      topics: ['try/catch', 'throw', 'custom exceptions'],
      size: '275 KB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787485431419,
      url: './Sources/JAVA%20LAB/JLP5.pdf'
    },
    {
      id: 'JAVA LAB/JLP4.pdf',
      subject: 'JAVA LAB',
      filename: 'JLP4.pdf',
      title: 'Java Lab Program 4',
      type: 'PDF',
      category: 'Lab program',
      unit: 'Lab 4',
      summary: 'Packages, abstract classes and interfaces.',
      topics: ['packages', 'abstract classes', 'interfaces'],
      size: '260 KB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787485411505,
      url: './Sources/JAVA%20LAB/JLP4.pdf'
    },
    {
      id: 'JAVA LAB/JLP2.pdf',
      subject: 'JAVA LAB',
      filename: 'JLP2.pdf',
      title: 'Java Lab Program 2',
      type: 'PDF',
      category: 'Lab program',
      unit: 'Lab 2',
      summary: 'Palindrome and command-line string sorting practice.',
      topics: ['strings', 'command-line arguments', 'sorting'],
      size: '53 KB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787485392776,
      url: './Sources/JAVA%20LAB/JLP2.pdf'
    },
    {
      id: 'JAVA LAB/JLP3.pdf',
      subject: 'JAVA LAB',
      filename: 'JLP3.pdf',
      title: 'Java Lab Program 3',
      type: 'PDF',
      category: 'Lab program',
      unit: 'Lab 3',
      summary: 'Method overloading, overriding, inheritance and interfaces.',
      topics: ['overloading', 'inheritance', 'interfaces'],
      size: '73 KB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787485376344,
      url: './Sources/JAVA%20LAB/JLP3.pdf'
    },
    {
      id: 'I & E/Unit--2.pdf',
      subject: 'I & E',
      filename: 'Unit--2.pdf',
      title: 'Unit 2 Notes',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 2',
      summary: 'Problem and customer identification notes.',
      topics: ['problem discovery', 'customers', 'validation'],
      size: '1.24 MB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787485228549,
      url: './Sources/I%20%26%20E/Unit--2.pdf'
    },
    {
      id: 'I & E/Unit--1.pdf',
      subject: 'I & E',
      filename: 'Unit--1.pdf',
      title: 'Unit 1 Notes',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 1',
      summary: 'Fundamentals of innovation and entrepreneurship.',
      topics: ['innovation', 'entrepreneurship', 'opportunities'],
      size: '759 KB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787485213192,
      url: './Sources/I%20%26%20E/Unit--1.pdf'
    },
    {
      id: 'DAA/DAA II-Unit.pdf',
      subject: 'DAA',
      filename: 'DAA II-Unit.pdf',
      title: 'DAA — Unit II',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 2',
      summary: 'Disjoint sets, graph connectivity and divide-and-conquer.',
      topics: ['disjoint sets', 'connectivity', 'divide and conquer'],
      size: '20.0 MB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787485140673,
      url: './Sources/DAA/DAA%20II-Unit.pdf'
    },
    {
      id: 'DAA/UNIT-2 PART2.pdf',
      subject: 'DAA',
      filename: 'UNIT-2 PART2.pdf',
      title: 'Unit 2 — Part 2',
      type: 'PDF',
      category: 'Scanned notes',
      unit: 'Unit 2',
      summary: 'Supplementary Unit 2 material.',
      topics: ['unit revision', 'worked notes'],
      size: '7.45 MB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787485090201,
      url: './Sources/DAA/UNIT-2%20PART2.pdf'
    },
    {
      id: 'SDE/SDE-UNIT-2.pdf',
      subject: 'SDE',
      filename: 'SDE-UNIT-2.pdf',
      title: 'SDE — Unit 2',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 2',
      summary: 'Software design process notes for Unit 2.',
      topics: ['design process', 'unit revision', 'key concepts'],
      size: '11.9 MB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787484974166,
      url: './Sources/SDE/SDE-UNIT-2.pdf'
    },
    {
      id: 'SDE/SDE-QB SOLUTIONS _Dr.G.J NAIK.pdf',
      subject: 'SDE',
      filename: 'SDE-QB SOLUTIONS _Dr.G.J NAIK.pdf',
      title: 'Question Bank Solutions',
      type: 'PDF',
      category: 'Question bank',
      unit: 'Practice set',
      summary: 'Question bank with answer solutions.',
      topics: ['practice questions', 'answers', 'exam revision'],
      size: '2.93 MB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787484952565,
      url: './Sources/SDE/SDE-QB%20SOLUTIONS%20_Dr.G.J%20NAIK.pdf'
    },
    {
      id: 'SDT/Unit-1__t-test & F-test for small samples.pdf',
      subject: 'SDT',
      filename: 'Unit-1__t-test & F-test for small samples.pdf',
      title: 't-Test & F-Test for Small Samples',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 1',
      summary: 'Small-sample t-test and F-test procedures.',
      topics: ['t-test', 'F-test', 'small samples'],
      size: '12.2 MB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787484667782,
      url: './Sources/SDT/Unit-1__t-test%20%26%20F-test%20for%20small%20samples.pdf'
    },
    {
      id: 'SDT/Unit-1__Test of Hypothesis.pdf',
      subject: 'SDT',
      filename: 'Unit-1__Test of Hypothesis.pdf',
      title: 'Test of Hypothesis',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 1',
      summary: 'Hypothesis-testing concepts and procedures.',
      topics: ['null hypothesis', 'critical region', 'test statistic'],
      size: '1.50 MB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787484631606,
      url: './Sources/SDT/Unit-1__Test%20of%20Hypothesis.pdf'
    },
    {
      id: 'SDT/Unit-1__Proportions & Confidence interval.pdf',
      subject: 'SDT',
      filename: 'Unit-1__Proportions & Confidence interval.pdf',
      title: 'Proportions & Confidence Intervals',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 1',
      summary: 'Confidence intervals and proportion-based inference.',
      topics: ['proportions', 'confidence intervals', 'estimation'],
      size: '2.01 MB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787484583236,
      url: './Sources/SDT/Unit-1__Proportions%20%26%20Confidence%20interval.pdf'
    },
    {
      id: 'SDT/Unit-1__STATISTICS AND DECISION THEORY.pdf',
      subject: 'SDT',
      filename: 'Unit-1__STATISTICS AND DECISION THEORY.pdf',
      title: 'Statistics & Decision Theory',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 1',
      summary: 'Statistics and decision theory overview.',
      topics: ['statistics', 'decision theory', 'sampling'],
      size: '340 KB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787484455935,
      url: './Sources/SDT/Unit-1__STATISTICS%20AND%20DECISION%20THEORY.pdf'
    },
    {
      id: 'SDT/Estimation Theory.pdf',
      subject: 'SDT',
      filename: 'Estimation Theory.pdf',
      title: 'Estimation Theory',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 1',
      summary: 'Point and interval estimation concepts.',
      topics: ['estimators', 'bias', 'efficiency'],
      size: '288 KB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787484380505,
      url: './Sources/SDT/Estimation%20Theory.pdf'
    },
    {
      id: 'JAVA/JAVA_Notes-1.pdf',
      subject: 'JAVA',
      filename: 'JAVA_Notes-1.pdf',
      title: 'Java Notes — Unit 1',
      type: 'PDF',
      category: 'Lecture notes',
      unit: 'Unit 1',
      summary: 'Java programming fundamentals and object-oriented concepts.',
      topics: ['Java basics', 'classes', 'object-oriented programming'],
      size: '1.14 MB',
      modifiedAt: 'Aug 23, 2026',
      modifiedMs: 1787483462237,
      url: './Sources/JAVA/JAVA_Notes-1.pdf'
    }
  ];

  const subjectGuides = {
    'CM LAB': {
      title: 'CM Lab study guide',
      summary: 'Keep each experiment, observation and viva answer ready in one revision flow.',
      focus: 'Practical record & viva prep',
      topics: ['Experiment setup', 'Observation tables', 'Result writing', 'Viva questions'],
      tip: 'Before a lab session, review the aim, procedure, expected output and precautions.',
      status: 'Add your lab manual or experiment sheets to this folder when they are available.'
    },
    DAA: {
      title: 'Design & Analysis of Algorithms',
      summary: 'Build confidence with complexity analysis, algorithm strategies and worked problems.',
      focus: 'Complexity & algorithm design',
      topics: ['Asymptotic analysis', 'Divide and conquer', 'Dynamic programming', 'Graph algorithms'],
      tip: 'For each algorithm, practise the idea, pseudocode, time complexity and one dry run.',
      status: '2 source PDFs are ready for revision.'
    },
    DBMS: {
      title: 'Database Management Systems',
      summary: 'Revise how data is modelled, queried, normalised and kept consistent.',
      focus: 'Database foundations',
      topics: ['ER modelling', 'SQL queries', 'Normalisation', 'Transactions & recovery'],
      tip: 'Draw schemas by hand and write a small SQL query set for every important topic.',
      status: 'Add class notes, SQL sheets or question papers to build this subject library.'
    },
    'DBMS LAB': {
      title: 'DBMS Lab workbook',
      summary: 'Prepare practical queries, schema designs and viva answers before lab day.',
      focus: 'SQL practice & records',
      topics: ['DDL and DML', 'Joins & subqueries', 'Constraints', 'Stored procedures'],
      tip: 'Keep one clean record of each query along with its result and a one-line explanation.',
      status: 'Add lab programs or record PDFs to this folder when they are available.'
    },
    'DEV LAB': {
      title: 'Development Lab workbook',
      summary: 'Organise project exercises, build steps and submission-ready checklists.',
      focus: 'Build, test & submit',
      topics: ['Project setup', 'Core features', 'Testing checklist', 'Demo & submission'],
      tip: 'After every lab, save a short README with setup steps, screenshots and what you learned.',
      status: 'Add exercise sheets, code handouts or project briefs to this folder when available.'
    },
    'I & E': {
      title: 'Innovation & Entrepreneurship',
      summary: 'Turn concepts into clear ideas, viable models and well-structured answers.',
      focus: 'Ideas to business models',
      topics: ['Idea generation', 'Business models', 'Market validation', 'Startup planning'],
      tip: 'Use one-page examples to connect every framework with a familiar product or startup.',
      status: '2 source PDFs are ready for revision.'
    },
    JAVA: {
      title: 'Core Java',
      summary: 'Strengthen the fundamentals that make programs easier to write, explain and debug.',
      focus: 'Object-oriented Java',
      topics: ['Classes & objects', 'Inheritance & interfaces', 'Exceptions', 'Collections & I/O'],
      tip: 'Read a concept, then write a tiny program from memory before checking the notes.',
      status: '1 source PDF is ready for revision.'
    },
    'JAVA LAB': {
      title: 'Java Lab programs',
      summary: 'Use a repeatable approach for programs, output checks and viva preparation.',
      focus: 'Programs, output & viva',
      topics: ['OOP programs', 'Interfaces & packages', 'Exception handling', 'File and collection tasks'],
      tip: 'For every program, know the input, output, key classes and the reason behind the approach.',
      status: '4 source PDFs are ready for revision.'
    },
    SDE: {
      title: 'SDE revision guide',
      summary: 'Use the unit notes and solved questions to create a focused, exam-ready revision plan.',
      focus: 'Units, concepts & practice',
      topics: ['Unit-wise concepts', 'Worked answers', 'Important definitions', 'Question bank practice'],
      tip: 'Attempt a question first, then use the solution to improve the structure of your answer.',
      status: '2 source PDFs are ready for revision.'
    },
    SDT: {
      title: 'Statistics & Decision Theory',
      summary: 'Master estimation, confidence intervals and hypothesis tests through repeat practice.',
      focus: 'Inference & decision making',
      topics: ['Estimation theory', 'Confidence intervals', 'Hypothesis testing', 't-Test & F-Test'],
      tip: 'Write the assumptions, test statistic, critical region and conclusion for every problem.',
      status: '5 source PDFs are ready for revision.'
    }
  };

  const summary = { subjectCount: 10, fileCount: 16 };

  window.CLASS_THINGS_DATA = { subjects, resources, subjectGuides, summary };
}());
