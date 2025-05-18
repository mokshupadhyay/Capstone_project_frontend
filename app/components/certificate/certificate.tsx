'use client';

import React from 'react';
import { usePDF, Resolution, Margin } from 'react-to-pdf';

const Certificate = ({
    studentName,
    projectName,
    teacherName,
    completionDate,
    projectDuration = '2 weeks',
    referenceNumber
}) => {
    // PDF configuration moved inside component
    const { toPDF, targetRef } = usePDF({
        filename: `${studentName} - ${projectName} Certificate.pdf`,
        method: 'save',
        resolution: Resolution.EXTREME,
        page: {
            margin: Margin.SMALL,
            format: 'letter',
            orientation: 'portrait'
        },
        canvas: {
            mimeType: 'image/jpeg',
            qualityRatio: 1
        },
        overrides: {
            pdf: {
                compress: true,
                floatPrecision: 1
            },
            canvas: {
                // scale: 1,
                logging: false,
                useCORS: true
            }
        }
    });

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        return isNaN(date.getTime())
            ? 'Unknown Date'
            : date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
    }

    const formattedDate = formatDate(completionDate);


    return (
        <div className="w-full max-w-4xl mx-auto">
            <button
                onClick={toPDF}  // Simplified callback
                className="mb-6 px-6 py-2 bg-[#2563eb] text-white rounded-md hover:bg-[#1d4ed8] flex items-center justify-center"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Certificate as PDF
            </button>

            <div ref={targetRef} className="bg-[#f9fafb] p-10 border-8 border-[#4b5563] shadow-lg">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center">
                        <div className="text-[#4f46e5] text-4xl font-bold">C</div>
                        <div className="text-[#1f2937] text-3xl font-bold">APSTONE PROJECT</div>
                    </div>
                    <div className="text-right text-sm text-[#4b5563]">
                        <div>Certificate no: {referenceNumber || 'UC-' + Math.random().toString(36).substring(2, 15)}</div>
                        <div>Reference Number: {Math.floor(1000 + Math.random() * 9000)}</div>
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-3xl uppercase font-bold text-[#1f2937] mb-4">Certificate of Completion</h1>

                    <h2 className="text-5xl font-bold mb-16 mt-8 text-[#111827]">{projectName}</h2>

                    <div className="text-xl mb-6">This certifies that</div>
                    <h3 className="text-4xl font-bold mb-6 text-[#111827]">{studentName}</h3>
                    <div className="text-lg mb-10">has successfully completed the project on {formattedDate}</div>

                    <div className="flex justify-between items-end mt-20">
                        <div className="text-left">
                            <div className="border-t-2 border-[#9ca3af] pt-2 w-48">
                                <div className="font-bold">{teacherName}</div>
                                <div className="text-sm text-[#6b7280]">Project Instructor</div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-[#6b7280] text-sm">
                                <div>Project Duration: {projectDuration}</div>
                                <div>Completion Date: {formattedDate}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificate;