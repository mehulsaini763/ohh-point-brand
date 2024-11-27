import { Eye } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ModalDetails = ({ data }) => {
  const [open, setOpen] = useState(false);

  const handleSubmitReopen = async () => {
    if (!reopenMessage) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      const queryRef = doc(db, "brandQueries", dataId);

      await updateDoc(queryRef, {
        status: "Reopened",
        reopenedMessage: reopenMessage,
      });

      toast.success("Issue reopened!");
      setReopenDialogOpen(false);
      setReopenMessage("");
      fetchQueries();
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
      {open && (
        <>
          <div className="absolute inset-0 bg-white/50 z-10 h-screen overflow-hidden grid place-content-center">
            <div className="m-auto bg-white p-6 rounded-xl shadow-lg w-full max-w-md overflow-y-auto max-h-96 border">
              <h2 className="text-lg font-bold mb-4">
                Query Details - {data.queryId}
              </h2>
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
              {["Resolved", "Closed"].includes(data.status) && (
                <textarea
                  className="w-full border rounded-3xl p-4 mb-4 bg-oohpoint-grey-200 font-light"
                  rows="4"
                  placeholder="Enter reason to reopen"
                  value={data.resolvedMessage}
                  onChange={(e) => setReopenMessage(e.target.value)}
                />
              )}
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-500 text-white py-2 px-6 rounded-xl hover:bg-gray-600"
                  onClick={() => setOpen(false)}
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
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ModalDetails;
