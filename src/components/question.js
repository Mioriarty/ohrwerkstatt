import './styled-button.js';
import { LitElement, html, css } from 'https://esm.sh/lit';

class Question extends LitElement {
  static properties = {
    state: { type: String },
    question: { type: String },
    questionNumber: { type: Number },
    description: { type: String },
    answers: { type: Array },
    correctAnswer: { type: Number },
    highlightIncorrect: { type: Number },
    highlightCorrect: { type: Boolean },
  };

  static styles = css`
    .question {
      padding: 1rem;
      border: 2px solid;
      border-radius: 18px;
      background-color: var(--background-color);
      transition: all 0.2s ease;
    }

    .question.state-active {
      border-color: var(--primary);
    }

    .question.state-correct {
      border-color: var(--success);
    }

    .question.state-incorrect {
      border-color: var(--error);
    }

    .question.state-disabled {
      border-color: var(--border);
      opacity: 0.6;
      transform: scale(0.97);
    }

    .question-badge {
      display: inline-block;
      padding: 0.5rem 0.75rem;
      text-wrap: nowrap;
      border-radius: 12px;
      color: white;
      font-size: 0.75rem;
      box-shadow: var(--shadow);
      width: fit-content;
    }

    .question-badge.state-active {
      background-color: var(--primary);
    }
    .question-badge.state-correct {
      background-color: var(--success);
    }
    .question-badge.state-incorrect {
      background-color: var(--error);
    }
    .question-badge.state-disabled {
      background-color: var(--border);
    }

    .question-title {
      font-size: 1.1rem;
      font-weight: bold;
      gap: 0.5rem;
      display: flex;
      align-items: center;
    }

    .title-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    hr {
      margin-top: 1rem;
      border: none;
      border-top: 1px solid var(--border);
    }

    .answers-container {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    styled-button.answer-btn::part(button) {
      background: var(--bg-muted);
      color: var(--text);
      border: 2px solid var(--border);
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 12px;
    }

    styled-button.answer-btn.state-active::part(button):hover {
      border-color: var(--primary);
    }
    styled-button.answer-btn.hightlight-correct::part(button) {
      border-color: var(--success);
      background-color: var(--success-light);
    }
    styled-button.answer-btn.hightlight-incorrect::part(button) {
      border-color: var(--error);
      background-color: var(--error-light);
    }
  `;

  render() {
    return html`
      <div class="question state-${this.state}">
        <div class="title-container">
          <div class="question-title">
            <div class="question-badge state-${this.state}">Question ${this.questionNumber}</div>
            ${this.question}
          </div>
          ${this.state === 'correct'
            ? html`<i class="fas fa-check" style="color: var(--success); font-weight: bold;"></i>`
            : this.state === 'incorrect'
            ? html`<i class="fas fa-times" style="color: var(--error); font-weight: bold;"></i>`
            : ''}
        </div>
        <hr />
        <div class="question-description">${this.description}</div>
        <div class="answers-container">
          ${this.answers.map(
            (answer, idx) =>
              html`
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
                <div>
                  <styled-button
                    class="
                        answer-btn 
                        state-${this.state} 
                        ${
                          this.highlightCorrect && idx === this.correctAnswer
                            ? 'hightlight-correct'
                            : ''
                        }
                        ${this.highlightIncorrect === idx ? 'hightlight-incorrect' : ''}
                    "
                    fullRow
                    style="width: 100%;"
                    .disabled=${this.state !== 'active'}
                    @click=${() => this._answer(idx)}
                    >
                        ${answer}
                        ${
                          this.highlightCorrect && idx === this.correctAnswer
                            ? html`<i
                                class="fas fa-check"
                                style="color: var(--success); font-weight: bold;"
                              ></i>`
                            : ''
                        }
                        ${
                          this.highlightIncorrect === idx
                            ? html`<i
                                class="fas fa-times"
                                style="color: var(--error); font-weight: bold;"
                              ></i>`
                            : ''
                        }
                    </styled-button
                </div>
              `
          )}
        </div>
      </div>
    `;
  }

  _answer(idx) {
    const correct = idx === this.correctAnswer;

    this.dispatchEvent(
      new CustomEvent('answered', {
        detail: { correct, selectedAnswer: idx, questionNumber: this.questionNumber },
        bubbles: true,
        composed: true,
      })
    );
  }
}

if (!customElements.get('big-question')) {
  customElements.define('big-question', Question);
}

export default Question;
