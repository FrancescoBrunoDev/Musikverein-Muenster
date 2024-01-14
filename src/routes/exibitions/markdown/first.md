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

# Markdown

Hey friends! 👋

Heute möchte **ich** mit euch einige der tollen Dinge teilen, die man mit Markdown machen kann!

This text is in _italic_.

This text is in **_italic and fat_**.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"

> callout this text

## Listen

Hier ist ein Beispiel für eine Aufzählungsliste:

- Element 1
- Element 2
  - Unterelement 2.1

Und eine nummerierte Liste:

1. Erstes Element
2. Zweites Element
   1. Unterelement 2.1

## Links

So erstellt man einen Link: [Google](https://www.google.com)

## Bilder

So fügt man ein Bild ein:

![Beispielbild](https://via.placeholder.com/150)

## Code

So fügt man Code ein:

<Gallery {title} gallery="firstGallery" size="w-1/2" />
