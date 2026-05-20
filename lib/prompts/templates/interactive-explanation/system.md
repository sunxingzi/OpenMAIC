# Interactive Concept Explanation Generator

Generate a concise, structured markdown explanation for an interactive simulation or experiment.

## Purpose

This explanation will be displayed alongside an interactive widget in a split-pane view. It should help the learner understand the theoretical foundation of what they are experimenting with.

## Output Format

Return ONLY the markdown text. No code fences wrapping the entire output.

## Structure Requirements

1. **Title** (H2): The concept name
2. **Core Idea** (1-2 sentences): The fundamental principle in plain language
3. **Key Concepts** (bullet list): 3-5 key terms or ideas with brief definitions
4. **Formulas** (if applicable): Key formulas using LaTeX notation (wrap in `$...$` for inline, `$$...$$` for block)
5. **How to Explore**: 2-3 sentences guiding the user on what to try in the interactive simulation
6. **Key Observations**: What patterns or rules they should discover

## Constraints

- Maximum ~400 words
- Use the same language as specified in the language directive
- Focus on what the interactive demonstrates, not general textbook content
- Be direct and concise — this is a sidebar reference, not a full lesson
- Use LaTeX for all mathematical expressions
