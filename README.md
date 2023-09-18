starting steps:
installed yarn globally
created app with yarn create vite, setting project name to client, selecting React as framework, and Javascript as variant.
changed directory into client and ran yarn in terminal

running yarn dev in client directory runs the application locally.

changed app.jsx to a single div with test as the text to test that it is updating as we make changes properly.

change directory in client and ran `yarn add tailwindcss postcss autoprefixer` which *installs tailwindcss with postcss and autoprefixer* then ran `npx tailwindcss init -p` which created Tailwind CSS config file: tailwind.config.js and PostCSS config file: postcss.config.js

Things I've learned
* Vite - doesn't bundle everything before starting the server, unlike traditional webpack in create-react-app (CRA). Vite uses ES build to pre-bundle files and so we can start the server and see changes immediately, whereas webpack has to re-bundle with each change. Note: to use env variables, you don't use `process.env.VARIABLE-NAME` but `import.meta.env.VARIABLE-NAME`.[[1]](https://www.youtube.com/watch?v=89NJdbYTgJ8)
* Tailwindcss - Tailwind CSS is a utility class library<sup>[[2]](https://youtu.be/ouncVBiye_M?t=229)</sup> that works by scanning all of your HTML files, JavaScript components, and any other templates for class names (kind of behaves like bootstrap with the class names but unlike bootstrap, which is a CSS framework, it doesn't have any pre-built components for you<sup>[[2]](https://youtu.be/ouncVBiye_M?t=229)</sup>), generating the corresponding styles and then writing them to a static CSS file.<sup>[[3]](https://tailwindcss.com/docs/installation/using-postcss)</sup> It'll also purge all unused css to an efficient bundle size. it's powerful but does need some configuration before starting.<sup>[[2]](https://youtu.be/ouncVBiye_M?t=229)</sup>
* postcss - tailwind can be installed as a postCSS plugin which helps integrate it with build tools like webpack and Vite, postCSS is a preprocessor<sup>[[4]](https://tailwindcss.com/docs/using-with-preprocessors)</sup> so that the CSS will be compiled quicker by allowing you to parse/read a css file written in a different syntax and converting it into plain CSS. This makes writing CSS faster, easier, and more modular <sup>[[5]](https://www.google.com/search?q=is+postcss+like+sass&rlz=1C1RXQR_enUS1044US1044&oq=is+postcss+like+sass&aqs=chrome..69i57.3565j0j1&sourceid=chrome&ie=UTF-8)</sup><sup>[[6]](https://github.com/postcss/postcss)</sup>
* autoprefixer - a postCSS plugin that parses CSS and add [vendor prefixes](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) to CSS rules <sup>[[7]](https://github.com/postcss/autoprefixer)</sup>

**Heartbeat refresh: https://www.reddit.com/r/reactjs/comments/erbwyq/best_practices_for_a_heartbeat_refresh/**

* Buffers: https://www.youtube.com/watch?v=4YRUyrbusvM
* Buffer.from: https://nodejs.org/api/buffer.html#static-method-bufferfrombuffer

* [Making superscripts in markdown files](https://stackoverflow.com/questions/15155778/superscript-in-markdown-github-flavored) credit goes to [Michael Wild on Stack Overflow](https://stackoverflow.com/users/159834/michael-wild)

* JWT Error: secretOrPrivateKey must have a value resolved by [Rabo Yusuf on Stack Overflow](https://stackoverflow.com/users/12221293/rabo-yusuf): <br></br> https://stackoverflow.com/questions/58673430/error-secretorprivatekey-must-have-a-value

* Send message icon on Chat.jsx page from [heroicons](https://heroicons.com/): To find, type in "paper-airplane" in the search bar of heroicons

* MERNChat icon on Chat.jsx page from [heroicons](https://heroicons.com/): To find, type in "chat" in the search bar of heroicons

* User icon on Chat.jsx page from [heroicons](https://heroicons.com/): To find, type in "user" in the search bar of heroicons and pick solid icons

* File icon on Chat.jsx page from [heroicons](https://heroicons.com/): To find, type in "paper-clip" in the search bar of heroicons