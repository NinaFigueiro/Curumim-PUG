import icons from 'url:../../img/icons.svg';

// We export the class itself cause we are not creating any instance of this view
// This class is only used as a parent class for the other child views
export default class View {
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe) 
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM 
     * @returns {undefined | string} A markup
     * @this {Object} View instance
     */
    render(data, render = true) {
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        
        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        // renders recipe
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    
    update(data) {
      this._data = data;
      const newMarkup = this._generateMarkup();

      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));

      // Comparing newElements array with curElements array
      newElements.forEach((newEl, i) => {
        const curEl = curElements[i];
        // console.log(curEl, newEl.isEqualNode(curEl));

        // Updates changed TEXT
        if(
          !newEl.isEqualNode(curEl) &&
          newEl.firstChild?.nodeValue.trim() !== ''
        ) {
          // console.log('🌟', newEl.firstChild.nodeValue.trim())
          curEl.textContent = newEl.textContent;
        }

        // Updates changed ATTRIBUTES
        if(!newEl.isEqualNode(curEl)) 
          Array.from(newEl.attributes).forEach(attr => 
            curEl.setAttribute(attr.name, attr.value))
      }); 
    }

    // removes start message from page
    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `
              <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
      };
    // we can pass in a message as argument but if we pass none, it gets this._errorMessage as default
    renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
        const markup = `
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

}