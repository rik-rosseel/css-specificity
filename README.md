# CSS Specificity
It's a fun quiz to learn and practice CSS Specificity.
URL: [css-specificity.smnarnold.com](https://css-specificity.smnarnold.com)

## Dev
Install the project with npm:
```
npm i 
```
Start SCSS & JS watcher:
```
npm run dev 
```

## Deployment
Minify files
```
npm run build
```
Upload dist folder content to server

## Level Structure
| Key | Type | Description |
| --- | ---- | ----------- |
| slug | String | Used in the URL and for the descriptions translations |
| html | String | HTML for this level. |
| shuffle | Bool | Can the answers order be random? *(true by default)* |
| answers | Array | Array of answers |    
| selector | String | CSS Selector for an answer |
| specificity | Number | Specificity of the matching selector |
| bg | String | A forced background-color for this answer |
| good | Bool | Is this answer the right one? | 

## Languages supported
- English, Français

## Contributors
- [smnarnold](https://github.com/smnarnold)
