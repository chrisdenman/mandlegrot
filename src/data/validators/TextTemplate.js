/**
 * @typedef TextTemplateData
 * @property {string} template
 */

/**
 * A simple text template class that interpolates tokens surrounded by handlebars {{tokenToInterpolate}}.
 */
export default class TextTemplate {

    /**
     * @type {string}
     */
    #template

    /**
     * @param {string} template
     */
    constructor(template) {
        this.#template = template;
    }

    get template() {
        return this.#template;
    }

    /**
     * @param {Map<String, String>} tokens
     *
     * @return {string}
     */
    interpolate = (tokens) =>
        [...tokens.entries()]
            .reduce(
                (acc, [token, replacement]) =>
                    acc.replaceAll(
                        `{{${token}}}`, replacement
                    ),
                this.#template
            );

    /**
     * @param {TextTemplateData} textTemplateData
     * @return {TextTemplate}
     */
    static hydrate = (textTemplateData) => new TextTemplate(textTemplateData.template);
}