
import React, { useState } from 'react';
import { Icon } from './Icon';
import { DayPlan } from '../data/phpTopics';

interface LearningPathProps {
    topicsByDay: DayPlan[];
    onTopicSelect: (code: string) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({ topicsByDay, onTopicSelect }) => {
    const [expandedDay, setExpandedDay] = useState<number | null>(1);

    const handleDayClick = (day: number) => {
        setExpandedDay(prev => (prev === day ? null : day));
    };

    return (
        <div className="flex flex-col h-full min-h-0 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 p-3 border-b border-slate-200 dark:border-slate-700">
                <Icon icon="book-open" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">30-Day PHP Plan</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-2">
                 <div className="space-y-1">
                    {topicsByDay.map(dayPlan => {
                        const isExpanded = expandedDay === dayPlan.day;
                        return (
                            <div key={dayPlan.day}>
                                <button
                                    onClick={() => handleDayClick(dayPlan.day)}
                                    className="w-full flex items-center justify-between text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    aria-expanded={isExpanded}
                                >
                                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        Day {dayPlan.day}: {dayPlan.title}
                                    </h3>
                                    <Icon icon={isExpanded ? 'chevron-down' : 'chevron-right'} className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                </button>
                                {isExpanded && (
                                    <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
                                       {dayPlan.topics.map(topic => (
                                           <div
                                               key={topic.name}
                                               onClick={() => onTopicSelect(topic.code)}
                                               className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group"
                                               title={`Click to load sample code for "${topic.name}"`}
                                           >
                                               <h4 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors text-xs">{topic.name}</h4>
                                               <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{topic.description}</p>
                                           </div>
                                       ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};
