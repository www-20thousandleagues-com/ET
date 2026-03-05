---
name: i18n
description: Set up or extend internationalization and localization
argument-hint: <action> (e.g., "setup i18n", "add Norwegian locale", "extract strings")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Internationalization

Action: $ARGUMENTS

## Setup (if not configured)
1. Install i18n library: `react-i18next` + `i18next`
2. Create translation files structure:
   ```
   src/locales/
   ├── en/
   │   ├── common.json
   │   ├── auth.json
   │   └── dashboard.json
   └── no/    (Norwegian)
       ├── common.json
       ├── auth.json
       └── dashboard.json
   ```
3. Configure i18next with language detection
4. Wrap app with I18nextProvider

## String Extraction
- Find all hardcoded strings in JSX
- Replace with `t('namespace.key')` calls
- Add to translation JSON files
- Handle pluralization, interpolation, and date/number formatting

## Rules
- Never hardcode user-facing strings
- Use namespaces to organize translations by feature
- Support RTL layouts if Arabic/Hebrew added
- Format dates/numbers with `Intl` API or i18next formatters
- Test with longest translation to catch overflow issues
