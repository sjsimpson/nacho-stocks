import './styles/Modal.scss'

export const Modal = ({
  handleClose,
  show,
  children,
}: {
  handleClose: Function
  show: boolean
  children: any
}) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none'

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button type="button" onClick={handleClose()}>
          Close
        </button>
      </section>
    </div>
  )
}
