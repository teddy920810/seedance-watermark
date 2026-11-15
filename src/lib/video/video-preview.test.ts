import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import VideoGenerator from '../../components/tools/VideoGenerator';

it('renders the requested preview action without paid consent', () => {
  const copy = { inputLabel: 'Describe your video', placeholder: 'A short scene' } as Parameters<typeof VideoGenerator>[0]['copy'];
  const html = renderToStaticMarkup(createElement(VideoGenerator, { copy, preview: true }));
  expect(html).toContain('Settings preview');
  expect(html).toContain('Review prompt</button>');
  expect(html).toContain('Aspect ratio');
  expect(html).toContain('Duration &amp; audio');
  expect(html).not.toContain('I understand this uses paid fal credits');
});

it('offers a sample-only demo when the hosted preview is explicitly enabled', () => {
  const copy = { inputLabel: 'Describe your video', placeholder: 'A short scene' } as Parameters<typeof VideoGenerator>[0]['copy'];
  const html = renderToStaticMarkup(createElement(VideoGenerator, { copy, preview: true, hostedDemo: true }));
  expect(html).toContain('Run demo');
  expect(html).toContain('DEMO · NO CHARGE');
  expect(html).not.toContain('paid fal credits');
});
