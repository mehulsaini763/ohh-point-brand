import Modal from "@/components/Modal";
import { MyContext } from "@/context/MyContext";
import { db } from "@/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const ModalCreateIssue = ({ refresh }) => {
  const { user } = useContext(MyContext);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [issueMessage, setIssueMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitIssue = async () => {
    setLoading(true);
    if (!issueMessage || !category) {
      toast.error("Please fill out all the fields.");
      return;
    }

    const queryId = `BQ${Date.now()}`;

    try {
      const queryRef = doc(db, "brandQueries", queryId);

      await setDoc(queryRef, {
        category,
        customerName: user.name,
        email: user.email,
        openMessage: issueMessage,
        status: "Opened",
        createdAt: serverTimestamp(),
        resolvedMessage: "",
        closedMessage: "",
        reopenedMessage: "",
        queryId: queryId,
        brandId: user.brandId,
      });

      toast.success("Issue submitted successfully!");
      setOpen(false);
      setIssueMessage("");
      setCategory("");
      refresh();
    } catch (error) {
      console.error("Error submitting issue:", error);
      toast.error("Failed to submit issue. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="bg-oohpoint-primary-2 hover:bg-oohpoint-primary-3 text-white py-2 px-6 rounded-lg hover:scale-95 transition-all"
        onClick={() => setOpen(true)}
      >
        Raise an Issue
      </button>
      <Modal
        className="bg-white p-6 px-10 rounded-2xl shadow-lg w-full max-w-md"
        open={open}
        close={() => setOpen(false)}
      >
        <h2 className="text-lg font-bold mb-4">Raise an Issue</h2>

        {/* Category Dropdown */}
        <select
          className="w-full border rounded-3xl p-4 mb-4 bg-oohpoint-grey-200 font-light"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a Category</option>
          <option value="Account Related">Account related</option>
          <option value="Payment Issue">Payment Issue</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          className="w-full border rounded-3xl p-4 mb-4 bg-oohpoint-grey-200 font-light"
          rows="4"
          placeholder="Describe your issue"
          value={issueMessage}
          onChange={(e) => setIssueMessage(e.target.value)}
        ></textarea>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white py-2 px-6 rounded-xl hover:bg-gray-600"
            onClick={() => {
              setOpen(false);
              setIssueMessage("");
              setCategory("");
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="flex items-center gap-2 bg-oohpoint-primary-2 text-white py-2 px-6 rounded-xl hover:bg-oohpoint-primary-3"
            onClick={handleSubmitIssue}
            disabled={loading}
          >
            {loading && <Loader2 color="white" className="animate-spin" />}{" "}
            Submit
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateIssue;
