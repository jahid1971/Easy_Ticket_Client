import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

const DeleteButton = ({
    handleDelete,
    button,
}: {
    handleDelete: any;
    button?: React.ReactNode;
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {button ? (
                    button
                ) : (
                    <Button className="mt-2" size={"xsm"}>
                        Delete
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <h4 className="text-2xl text-center">Are you Sure?</h4>
                <h5 className="text-xl text-center text-slate-500">
                    You won't be able to revert this!
                </h5>

                <div className="flex justify-between px-14 mt-8">
                    <DialogClose asChild>
                        <Button onClick={() => handleDelete()}>Yes</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant={"base"}>No</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteButton;
