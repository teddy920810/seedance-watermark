import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import VideoGenerator from '../../components/tools/VideoGenerator';

it('renders the public settings preview without a paid consent or submit control', () => {
  const copy = { inputLabel: 'Describe your video', placeholder: 'A short scene' } as Parameters<typeof VideoGenerator>[0]['copy'];
  const html = renderToStaticMarkup(createElement(VideoGenerator, { copy, preview: true }));
  expect(html).toContain('Settings preview');
  expect(html).toContain('Check prompt');
  expect(html).toContain('Aspect ratio');
  expect(html).toContain('Duration &amp; audio');
  expect(html).not.toContain('Generate video</button>');
  expect(html).not.toContain('I understand this uses paid fal credits');
});
