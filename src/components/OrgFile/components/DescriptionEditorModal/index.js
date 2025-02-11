import React, { PureComponent } from 'react';

import './stylesheet.css';

import _ from 'lodash';

import { createRawDescriptionText } from '../../../../lib/export_org';
import { getCurrentTimestampAsText } from '../../../../lib/timestamps';

export default class DescriptionEditorModal extends PureComponent {
  constructor(props) {
    super(props);

    _.bindAll(this, ['handleTextareaRef', 'handleDescriptionChange', 'handleInsertTimestamp']);

    this.state = {
      descriptionValue: props.editRawValues
        ? this.calculateRawDescription(props.header)
        : props.header.get('rawDescription'),
    };
  }

  componentDidMount() {
    this.props.setPopupCloseActionValuesAccessor(() => [this.state.descriptionValue]);
  }

  componentDidUpdate(prevProps) {
    const { header, editRawValues } = this.props;
    if (prevProps.header !== header || prevProps.editRawValues !== editRawValues) {
      this.setState({
        descriptionValue: this.props.editRawValues
          ? this.calculateRawDescription(header)
          : header.get('rawDescription'),
      });
      this.textarea.focus();
    }
  }

  calculateRawDescription(header) {
    // This generates the text that appears in the description text field.
    const dontIndent = this.props.dontIndent;
    return createRawDescriptionText(header, false, dontIndent);
  }

  handleTextareaRef(textarea) {
    this.textarea = textarea;
  }

  handleDescriptionChange(event) {
    this.setState({ descriptionValue: event.target.value });
  }

  handleInsertTimestamp() {
    const { descriptionValue } = this.state;
    const insertionIndex = this.textarea.selectionStart;
    this.setState({
      descriptionValue:
        descriptionValue.substring(0, insertionIndex) +
        getCurrentTimestampAsText() +
        descriptionValue.substring(this.textarea.selectionEnd || insertionIndex),
    });
    this.textarea.focus();
  }

  render() {
    return (
      <>
        <h2 className="drawer-modal__title">
          {this.props.editRawValues ? 'Edit full description' : 'Edit description'}
        </h2>

        <div className="header-content__edit-container">
          <textarea
            autoFocus
            className="textarea drag-handle"
            rows="8"
            ref={this.handleTextareaRef}
            value={this.state.descriptionValue}
            onChange={this.handleDescriptionChange}
          />
          <div
            className="header-content__insert-timestamp-button"
            onClick={this.handleInsertTimestamp}
          >
            <i className="fas fa-plus insert-timestamp-icon" />
            Insert timestamp
          </div>
        </div>
      </>
    );
  }
}
