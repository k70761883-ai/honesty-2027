import React from 'react';
import { Project, ProjectStatusConfig, Client } from '../../../types';
import ProjectCard from './ProjectCard';
import { EyeIcon } from '../../../constants';
import { PencilIcon, Trash2Icon, ArrowDownIcon } from 'lucide-react';
import { getStatusColor, getStatusClass, getSubStatusText, getDisplayProgress } from '../utils/projectHelpers';

export interface ProjectListViewProps {
    projects: Project[];
    handleOpenDetailModal: (project: Project) => void;
    handleOpenForm: (mode: 'edit', project: Project) => void;
    handleProjectDelete: (projectId: string) => void;
    config: ProjectStatusConfig[];
    clients: Client[];
    handleQuickStatusChange: (projectId: string, newStatus: string, notifyClient: boolean) => Promise<void>;
    handleSendMessage: (project: Project) => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
    projects, handleOpenDetailModal, handleOpenForm, handleProjectDelete,
    config, clients, handleQuickStatusChange, handleSendMessage,
    hasMore, isLoadingMore, onLoadMore
}) => {
    const ProgressBar: React.FC<{ progress: number, status: string, config: ProjectStatusConfig[] }> = ({ progress, status, config }) => (
        <div className="w-full bg-[#F4F6F9] rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: getStatusColor(status, config) }}></div>
        </div>
    );

    return (
        <div>
            {/* Mobile cards - Using ProjectCard Component */}
            <div className="md:hidden space-y-2 p-2 sm:p-2.5">
                {projects.map(p => {
                    const client = clients.find(c => c.id === p.clientId);
                    return (
                        <ProjectCard
                            key={p.id}
                            project={p}
                            client={client}
                            projectStatusConfig={config}
                            onStatusChange={(projectId, newStatus) => handleQuickStatusChange(projectId, newStatus, false)}
                            onViewDetails={handleOpenDetailModal}
                            onEdit={(project) => handleOpenForm('edit', project)}
                            onSendMessage={handleSendMessage}
                        />
                    );
                })}
                {projects.length === 0 && <p className="text-center py-6 text-xs sm:text-sm text-[#5A6A85]">Tidak ada Acara Pernikahan dalam kategori ini.</p>}
            </div>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-xs lg:text-sm text-left">
                    <thead className="text-xs text-[#5A6A85] uppercase bg-[#F4F6F9]/80 border-b border-[#EAEFF4]">
                        <tr>
                            <th className="px-3 lg:px-4 py-2.5 font-bold tracking-wider text-center w-12">No</th>
                            <th className="px-3 lg:px-6 py-2.5 font-bold tracking-wider">Nama Acara Pernikahan</th>
                            <th className="px-3 lg:px-6 py-2.5 font-bold tracking-wider">Pengantin</th>
                            <th className="px-3 lg:px-6 py-2.5 font-bold tracking-wider">Tanggal</th>
                            <th className="px-3 lg:px-6 py-2.5 font-bold tracking-wider min-w-[140px] lg:min-w-[200px]">Progress</th>
                            <th className="px-3 lg:px-6 py-2.5 font-bold tracking-wider">Tim</th>
                            <th className="px-3 lg:px-6 py-2.5 font-bold tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAEFF4]">
                        {projects.map((p, index) => (
                            <tr key={p.id} className="hover:bg-[#F4F6F9]/50 transition-colors">
                                <td className="px-3 lg:px-4 py-2.5 text-center font-bold text-[#5A6A85]">{index + 1}</td>
                                <td className="px-3 lg:px-6 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-[#2A3547] text-sm leading-tight">{p.projectName}</p>
                                    </div>
                                    <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 leading-tight ${getStatusClass(p.status, config)}`}>
                                        {getSubStatusText(p)}
                                    </p>
                                </td>
                                <td className="px-3 lg:px-6 py-2.5 text-[#5A6A85] font-medium">{p.clientName}</td>
                                <td className="px-3 lg:px-6 py-2.5 text-[#5A6A85] font-medium whitespace-nowrap">{new Date(p.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                <td className="px-3 lg:px-6 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <ProgressBar progress={getDisplayProgress(p, config)} status={p.status} config={config} />
                                        <span className="text-xs font-bold text-[#5A6A85] min-w-[32px] text-right">{getDisplayProgress(p, config)}%</span>
                                    </div>
                                </td>
                                <td className="px-3 lg:px-6 py-2.5 text-[#5A6A85] font-medium max-w-[120px] lg:max-w-none truncate">{p.team.map(t => t.name.split(' ')[0]).join(', ') || '-'}</td>
                                <td className="px-3 lg:px-6 py-2.5">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <button onClick={() => handleOpenDetailModal(p)} className="w-7 h-7 rounded-lg bg-[#ECF2FF] hover:bg-[#5D87FF] text-[#5D87FF] hover:text-white flex items-center justify-center transition-all" title="Detail Acara Pernikahan"><EyeIcon className="w-3.5 h-3.5 flex-shrink-0" /></button>
                                        <button onClick={() => handleOpenForm('edit', p)} className="w-7 h-7 rounded-lg bg-[#FEF5E5] hover:bg-[#FFAE1F] text-[#FFAE1F] hover:text-white flex items-center justify-center transition-all" title="Edit Acara Pernikahan"><PencilIcon className="w-3.5 h-3.5 flex-shrink-0" /></button>
                                        <button onClick={() => handleProjectDelete(p.id)} className="w-7 h-7 rounded-lg bg-[#FDEDE8] hover:bg-[#FA896B] text-[#FA896B] hover:text-white flex items-center justify-center transition-all" title="Hapus Acara Pernikahan"><Trash2Icon className="w-3.5 h-3.5 flex-shrink-0" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {hasMore && (
                <div className="mt-4 flex justify-center pb-4">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ECF2FF] hover:bg-[#d8e6ff] text-[#5D87FF] font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#5D87FF] border-t-transparent rounded-full animate-spin"></div>
                                Loading...
                            </>
                        ) : (
                            <>
                                <ArrowDownIcon className="w-4 h-4" />
                                Muat Lebih Banyak
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export interface ProjectKanbanViewProps {
    projects: Project[];
    handleOpenDetailModal: (project: Project) => void;
    draggedProjectId: string | null;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, projectId: string) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: string) => void;
    config: ProjectStatusConfig[];
}

export const ProjectKanbanView: React.FC<ProjectKanbanViewProps> = ({
    projects, handleOpenDetailModal, draggedProjectId,
    handleDragStart, handleDragOver, handleDrop, config
}) => {
    const ProgressBar: React.FC<{ progress: number, status: string, config: ProjectStatusConfig[] }> = ({ progress, status, config }) => (
        <div className="w-full bg-[#F4F6F9] rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: getStatusColor(status, config) }}></div>
        </div>
    );

    return (
        <div className="flex items-start gap-3 md:gap-4 overflow-x-auto pb-3 overscroll-x-contain scroll-smooth projects-kanban-scroll hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
            {config
                .filter(statusConfig => statusConfig.name !== 'Dibatalkan')
                .map(statusConfig => {
                    const status = statusConfig.name;
                    const columnProjects = projects.filter(p => p.status === status);
                    return (
                        <div
                            key={status}
                            className="w-64 min-w-[250px] md:w-72 flex-shrink-0 h-fit bg-[#F4F6F9] rounded-xl border border-[#EAEFF4] snap-start"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, status)}
                        >
                            <div className="px-3 py-2 font-bold text-[#2A3547] border-b-2 flex justify-between items-center sticky top-0 bg-[#F4F6F9]/95 backdrop-blur-sm rounded-t-xl z-10" style={{ borderBottomColor: getStatusColor(status, config) }}>
                                <span className="text-xs sm:text-sm leading-tight truncate">{status}</span>
                                <span className="text-[11px] font-bold bg-white text-[#5A6A85] px-2 py-0.5 rounded-full shadow-xs shrink-0">{columnProjects.length}</span>
                            </div>
                            <div className="p-2 space-y-2 max-h-[calc(100vh-260px)] overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                                {columnProjects.map(p => {
                                    const progress = getDisplayProgress(p, config);
                                    return (
                                        <div
                                            key={p.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, p.id)}
                                            onClick={() => handleOpenDetailModal(p)}
                                            className={`p-2.5 bg-white rounded-xl cursor-grab border-l-4 shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-md transition-all h-fit ${draggedProjectId === p.id ? 'opacity-50 ring-2 ring-[#5D87FF]' : 'opacity-100'}`}
                                            style={{ borderLeftColor: getStatusColor(p.status, config) }}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-bold text-xs sm:text-sm text-[#2A3547] leading-tight truncate">{p.projectName}</p>
                                                <span className="text-[10px] text-[#5A6A85] font-medium shrink-0 leading-tight">
                                                    {new Date(p.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 mt-0.5">
                                                <p className="text-[11px] text-[#5A6A85] leading-tight truncate">{p.clientName}</p>
                                                <p className="text-[10px] font-bold text-[#2A3547] leading-tight truncate shrink-0 max-w-[48%]">
                                                    {getSubStatusText(p)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <ProgressBar progress={progress} status={p.status} config={config} />
                                                <span className="text-[10px] font-bold text-[#5A6A85] shrink-0 tabular-nums">{progress}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {columnProjects.length === 0 && (
                                    <p className="text-center py-3 text-[11px] text-[#5A6A85]/70">Kosong</p>
                                )}
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};
