---
title: First exibition
description: First exibition.
categories:
  - sveltekit
  - svelte
published: true
img: https://picsum.photos/1500/1300
---
<script>
  import Gallery from "$components/markdown/Gallery.svelte"
</script>

## Markdown

Hey friends! 👋

Heute möchte \*\*ich mit euch einige der tollen Dinge teilen, die man mit Markdown machen kann!

### Listen

Hier ist ein Beispiel für eine Aufzählungsliste:

- Element 1
- Element 2
  - Unterelement 2.1

Und eine nummerierte Liste:

1. Erstes Element
2. Zweites Element
   1. Unterelement 2.1

### Links

So erstellt man einen Link: [Google](https://www.google.com)

### Bilder

So fügt man ein Bild ein:

![Beispielbild](https://via.placeholder.com/150)

### Code

So fügt man Code ein:

<Gallery {title} gallery="firstGallery" size="w-1/2" />
