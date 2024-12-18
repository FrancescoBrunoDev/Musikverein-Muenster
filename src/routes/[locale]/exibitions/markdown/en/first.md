---
title: First exibition
description: First exibition.
categories:
  - sveltekit
  - svelte
published: true
img: /exibitions/first_exibition/secondgallery/File13749.jpg
---

<script>
  import Gallery from "$components/markdown/gallery/Gallery.svelte"
  import Note from "$components/markdown/Note.svelte"

  const gallery = {
    title: 'titolo',
    cover: '/exibitions/first_exibition/firstgallery/00001.png',
    images: [{
      src: '/exibitions/first_exibition/firstgallery/00002.png',
      caption: "halloWorld"
    },
    {
      src: '/exibitions/first_exibition/firstgallery/00003.png',
      caption: "halloWorld"
    },
    {
      src: '/exibitions/first_exibition/secondgallery/File13749.jpg',
      caption: "halloWorld"
    }]
  }
    const gallery2 = {
    title: 'titolo',
    cover: '/exibitions/first_exibition/firstgallery/00005.png',
    images: [{
      src: '/exibitions/first_exibition/firstgallery/00006.png',
      caption: "halloWorld"
    },
    {
      src: '/exibitions/first_exibition/firstgallery/00007.png',
      caption: "halloWorld"
    },
    {
      src: '/exibitions/first_exibition/secondgallery/File13749.jpg',
      caption: "halloWorld"
    }]
  }
</script>

# Markdown

# Hey friends! 👋

Today I want to **share** with you some of the cool things you can do with Markdown!

This text is in _italic_.

This text is in **_*italic and bold*_**.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi <Note content="autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fu" underlinedText="nesciunt" />. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

> Callout this text

## Lists

Here's an example of a bulleted list:

- Element 1
- Element 2
  - Sub-element 2.1

And a numbered list:

1. First element
2. Second element
   1. Sub-element 2.1

## Links

Here's how to create a link: [Google](https://www.google.com)

## Images

How to insert an image:
![Example image](/exibitions/first_exibition/secondgallery/File13749.jpg)

Or even better:
<Gallery gallery={{ title: 'Grimm', cover: '/exibitions/first_exibition/secondgallery/File13749.jpg' }} />

### More galleries

<div class="w-full flex flex-col gap-2">
<Gallery gallery={gallery} className="h-fit" />
<Gallery gallery={gallery2} className="h-fit" />
</div>
