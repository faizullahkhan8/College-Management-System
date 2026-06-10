import React from "react";
import { FiX, FiFileText, FiDollarSign, FiUsers } from "react-icons/fi";
import CustomButton from "../CustomButton";
import { useTheme } from "../../contexts/ThemeContext";

const CreateFeeModal = ({
    show,
    onClose,
    formData,
    onInputChange,
    onTargetChange,
    onSubmit,
    loading,
    branches,
    targetTypes,
    semesters,
    students,
    searchStudents,
    addStudent,
    removeStudent,
}) => {
    const { isDark } = useTheme();
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/50 z-50 flex items-center justify-center p-4">
            <div
                className={`rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
                <div
                    className={`p-6 flex justify-between items-center border-b ${isDark ? "border-gray-700" : "border-gray-300"}`}
                >
                    <h2
                        className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                    >
                        Create Fee Structure
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                    >
                        <FiX
                            className={
                                isDark ? "text-gray-400" : "text-gray-600"
                            }
                        />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div>
                        <h3
                            className={`text-lg font-semibold mb-4 flex items-center ${isDark ? "text-gray-100" : "text-gray-900"}`}
                        >
                            <FiFileText className="mr-2" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={onInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                    Description
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={onInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amount & Dates */}
                    <div>
                        <h3
                            className={`text-lg font-semibold mb-4 flex items-center ${isDark ? "text-gray-100" : "text-gray-900"}`}
                        >
                            <FiDollarSign className="mr-2" />
                            Amount & Dates
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                    Amount (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={onInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                    Last Date *
                                </label>
                                <input
                                    type="date"
                                    name="lastDate"
                                    value={formData.lastDate}
                                    onChange={onInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                    Late Fee (₹)
                                </label>
                                <input
                                    type="number"
                                    name="lateFee"
                                    value={formData.lateFee}
                                    onChange={onInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Target Selection */}
                    <div>
                        <h3
                            className={`text-lg font-semibold mb-4 flex items-center ${isDark ? "text-gray-100" : "text-gray-900"}`}
                        >
                            <FiUsers className="mr-2" />
                            Target Audience
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                    Target Type *
                                </label>
                                <select
                                    name="targetType"
                                    value={formData.targetType}
                                    onChange={onInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                                >
                                    {targetTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.targetType === "BRANCH" && (
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                    >
                                        Select Branches
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {branches.map((branch) => (
                                            <label
                                                key={branch._id}
                                                className={`flex items-center p-3 border rounded-lg cursor-pointer ${isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.targets.branches.includes(
                                                        branch._id,
                                                    )}
                                                    onChange={(e) => {
                                                        const newBranches = e
                                                            .target.checked
                                                            ? [
                                                                  ...formData
                                                                      .targets
                                                                      .branches,
                                                                  branch._id,
                                                              ]
                                                            : formData.targets.branches.filter(
                                                                  (id) =>
                                                                      id !==
                                                                      branch._id,
                                                              );
                                                        onTargetChange(
                                                            "branches",
                                                            newBranches,
                                                        );
                                                    }}
                                                    className="mr-2"
                                                />
                                                <span
                                                    className={`text-sm ${isDark ? "text-gray-100" : "text-gray-700"}`}
                                                >
                                                    {branch.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.targetType === "SEMESTER" && (
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                    >
                                        Select Semesters
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {semesters.map((sem) => (
                                            <label
                                                key={sem}
                                                className={`flex items-center p-3 border rounded-lg cursor-pointer ${isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.targets.semesters.includes(
                                                        sem,
                                                    )}
                                                    onChange={(e) => {
                                                        const newSemesters = e
                                                            .target.checked
                                                            ? [
                                                                  ...formData
                                                                      .targets
                                                                      .semesters,
                                                                  sem,
                                                              ]
                                                            : formData.targets.semesters.filter(
                                                                  (s) =>
                                                                      s !== sem,
                                                              );
                                                        onTargetChange(
                                                            "semesters",
                                                            newSemesters,
                                                        );
                                                    }}
                                                    className="mr-2"
                                                />
                                                <span
                                                    className={`text-sm ${isDark ? "text-gray-100" : "text-gray-700"}`}
                                                >
                                                    {sem}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.targetType === "INDIVIDUAL" && (
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                    >
                                        Select Students
                                    </label>
                                    <div className="space-y-2">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Search students..."
                                                value={searchStudents}
                                                onChange={(e) =>
                                                    setSearchStudents(
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addStudent(
                                                        selectedStudents[0],
                                                    )
                                                }
                                                className={`px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white`}
                                                disabled={
                                                    !selectedStudents[0] ||
                                                    formData.targets.students.includes(
                                                        selectedStudents[0],
                                                    )
                                                }
                                            >
                                                Add Selected
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            {students.map((student) => (
                                                <div
                                                    key={student._id}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                                >
                                                    <div>
                                                        <div className="font-medium text-sm">
                                                            {student.firstName}{" "}
                                                            {student.lastName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {
                                                                student.enrollmentNo
                                                            }
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeStudent(
                                                                student._id,
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Selected Students */}
                                    {formData.targets.students.length > 0 && (
                                        <div className="space-y-2">
                                            <label
                                                className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                            >
                                                Selected Students
                                            </label>
                                            <div className="space-y-1">
                                                {formData.targets.students.map(
                                                    (student) => (
                                                        <div
                                                            key={student._id}
                                                            className={`flex items-center justify-between p-2 rounded ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                                                        >
                                                            <div>
                                                                <div
                                                                    className={`font-medium text-sm ${isDark ? "text-gray-100" : "text-gray-900"}`}
                                                                >
                                                                    {
                                                                        student.firstName
                                                                    }{" "}
                                                                    {
                                                                        student.lastName
                                                                    }
                                                                </div>
                                                                <div
                                                                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                                                                >
                                                                    {
                                                                        student.enrollmentNo
                                                                    }
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeStudent(
                                                                        student._id,
                                                                    )
                                                                }
                                                                className={`text-red-500 hover:text-red-700 ${isDark ? "hover:text-red-400" : "hover:text-red-700"}`}
                                                            >
                                                                <FiX />
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <CustomButton
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </CustomButton>
                        <CustomButton type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Fee"}
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFeeModal;
