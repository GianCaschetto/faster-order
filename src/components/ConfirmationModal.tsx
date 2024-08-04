type ConfirmationModalProps = {
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
  };
  
  function ConfirmationModal({text,  onConfirm, onCancel }: ConfirmationModalProps) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-xl font-bold mb-4">Confirmación</h2>
          <p className="mb-4">{text}</p>
          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ConfirmationModal;
  