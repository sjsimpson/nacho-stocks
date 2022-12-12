import './styles/ComponentTesting.scss'

import { useState } from 'react'

import {
  Button,
  ButtonVariants,
  TextInput,
  TextInputVariants,
  IconVariants,
} from 'm3-react'

import { Card, CardStyles } from './common/Card'

export const ComponentTesting = () => {
  let [input1, setInput1] = useState<string>('')
  let [input2, setInput2] = useState<string>('')
  let [input3, setInput3] = useState<string>('')
  let [input4, setInput4] = useState<string>('')

  return (
    <>
      <div>
        <div>BUTTONS</div>
        <Button
          type={ButtonVariants.ButtonStyles.elevated}
          text="Elevated"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.filled}
          text="Filled"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.tonal}
          text="Tonal"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.outlined}
          text="Outlined"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.text}
          text="Text"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.text}
          text="Text"
          onClick={() => {}}
          disabled={true}
        />
      </div>
      <div>
        <div>INPUTS</div>
        <div className="field-container">
          <TextInput
            id="input1"
            label="input1label"
            value={input1}
            inputStyle={TextInputVariants.TextInputStyles.filled}
            background={TextInputVariants.TextInputColors.tintedSurface}
            onInput={(event: any) => setInput1(event.target.value)}
            placeholder="input1"
          />
        </div>
        <div className="field-container">
          <TextInput
            id="input2"
            label="input2label"
            value={input2}
            inputStyle={TextInputVariants.TextInputStyles.outlined}
            background={TextInputVariants.TextInputColors.tintedSurface}
            onInput={(event: any) => setInput2(event.target.value)}
            placeholder="input2"
          />
        </div>
        <div className="field-container">
          <TextInput
            id="input3"
            label="input3label"
            value={input3}
            inputStyle={TextInputVariants.TextInputStyles.outlined}
            icon={IconVariants.IconStyles.search}
            background={TextInputVariants.TextInputColors.tintedSurface}
            onInput={(event: any) => setInput3(event.target.value)}
            placeholder="input3"
          />
        </div>
        <div className="field-container ts">
          <TextInput
            id="input4"
            label="input4label"
            value={input4}
            inputStyle={TextInputVariants.TextInputStyles.outlined}
            background={TextInputVariants.TextInputColors.tintedSurface}
            onInput={(event: any) => setInput4(event.target.value)}
            placeholder="input4"
          />
        </div>
      </div>
      <div>
        <div className="card-container">
          <Card cardStyle={CardStyles.elevated}>
            <div>TEST</div>
          </Card>
        </div>
        <div className="card-container">
          <Card cardStyle={CardStyles.filled}>
            <div>TEST</div>
          </Card>
        </div>
        <div className="card-container">
          <Card cardStyle={CardStyles.outlined}>
            <div>TEST</div>
          </Card>
        </div>
      </div>
    </>
  )
}
