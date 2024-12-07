import Modal from "@/components/Modal";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Eye } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ModalDetails = ({ data, refresh }) => {
  const [open, setOpen] = useState(false);
  const [reopenMessage, setReopenMessage] = useState("");

  const handleSubmitReopen = async () => {
    if (!reopenMessage && reopenMessage !== "") {
      toast.error("Please enter a message.");
      return;
    }

    try {
      const queryRef = doc(db, "brandQueries", data.id);

      await updateDoc(queryRef, {
        status: "Reopened",
        reopenedMessage: reopenMessage,
      });

      toast.success("Issue reopened!");
      setOpen(false);
      setReopenMessage("");
      refresh();
    } catch (error) {
      console.error("Error reopening issue:", error);
      toast.error("Failed to reopen issue. Please try again.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button className="w-fit" onClick={() => setOpen(true)}>
          <Eye size={28} color="white" fill="purple" />
        </button>
      </div>
      <Modal
        className={
          "m-auto bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[512px] border overflow-hidden"
        }
        open={open}
        close={() => setOpen(false)}
      >
        <h2 className="text-lg font-bold mb-4">
          Query Details - {data.queryId}
        </h2>
        <div className="h-full overflow-y-auto">
          <div className="mb-4">
            <h3 className="font-semibold">Open Message:</h3>
            <p className="bg-oohpoint-grey-200 rounded-3xl p-4">
              {data.openMessage}
            </p>
          </div>
          {data.resolvedMessage && (
            <div className="mb-4">
              <h3 className="font-semibold">Resolved Message:</h3>
              <p className="bg-oohpoint-grey-200 rounded-3xl p-4">
                {data.resolvedMessage}
              </p>
            </div>
          )}
          {data.reopenedMessage && (
            <div className="mb-4">
              <h3 className="font-semibold">Reopened Message:</h3>
              <p className="bg-oohpoint-grey-200 rounded-3xl p-4">
                {data.reopenedMessage}
              </p>
            </div>
          )}
          {data.closedMessage && (
            <div className="mb-4">
              <h3 className="font-semibold">Closed Message:</h3>
              <p className="bg-oohpoint-grey-200 rounded-3xl p-4">
                {data.closedMessage}
              </p>
            </div>
          )}
          {"Resolved" == data.status && (
            <>
              <h3 className="font-semibold">Reopen Message:</h3>
              <textarea
                className="w-full border rounded-3xl p-4 mb-4 bg-oohpoint-grey-200 font-light"
                rows="4"
                placeholder="Enter reason to reopen"
                value={reopenMessage}
                onChange={(e) => setReopenMessage(e.target.value)}
              />
            </>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white py-2 px-6 rounded-xl hover:bg-gray-600"
            onClick={() => {
              setOpen(false);
              setReopenMessage("");
            }}
          >
            Close
          </button>
          {data.status == "Resolved" && (
            <button
              className="bg-oohpoint-primary-2 text-white py-2 px-6 rounded-xl hover:bg-oohpoint-primary-3"
              onClick={handleSubmitReopen}
            >
              Reopen
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalDetails;
