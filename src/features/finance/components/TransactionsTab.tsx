import React, { useState } from 'react';
import { FinancialPocket, Transaction, TransactionType } from '../../../types';
import { formatCurrency } from '../../../utils/currency';
import { DownloadIcon, PencilIcon, Trash2Icon, ArrowDownIcon } from '../../../constants';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { MobileCollapsibleSection } from '../../../components/ui/MobileProgressiveDisclosure';

interface CategoryTotals {
    income: { [key: string]: number };
    expense: { [key: string]: number };
}

interface TransactionsTabProps {
    monthlyBudgetPocket?: FinancialPocket;
    onTutupAnggaran: () => void;
    categoryTotals: CategoryTotals;
    categoryFilter: { type: TransactionType | 'all'; category: string };
    setCategoryFilter: (filter: { type: TransactionType | 'all'; category: string }) => void;
    filters: { searchTerm: string; dateFrom: string; dateTo: string };
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDownloadTransactionsCSV: () => void;
    filteredSummary: { income: number; expense: number; net: number };
    filteredTransactions: Transaction[];
    getTransactionSubDescription: (t: Transaction) => string | null;
    onOpenModal: (type: 'transaction', mode: 'add' | 'edit', data?: any) => void;
    onDeleteTransaction: (id: string) => void;
    hasMore: boolean;
    loadMoreTransactions: () => void;
    isLoadingMore: boolean;
}

const CategoryButton: React.FC<{
    type: TransactionType;
    categoryName: string;
    amount: number;
    isActive: boolean;
    onClick: () => void;
}> = ({ type, categoryName, amount, isActive, onClick }) => {
    const isIncome = type === TransactionType.INCOME;

    return (
        <button
            onClick={onClick}
            className={`w-full min-h-[44px] flex justify-between items-center text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                isActive
                    ? isIncome
                        ? 'bg-[#EAFBF6] border-[#7FDDB8] text-[#126B57] shadow-sm'
                        : 'bg-[#FFF1EE] border-[#F7A58A] text-[#B63E2E] shadow-sm'
                    : 'border-transparent text-[#2A3547] hover:bg-[#F4F6F9]'
            }`}
        >
            <span className="truncate">{categoryName}</span>
            <span
                className={`font-bold text-xs ${
                    amount > 0
                        ? isIncome
                            ? 'text-[#0D8A6B]'
                            : 'text-[#D75C45]'
                        : 'text-[#5A6A85]'
                }`}
            >
                {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(amount)}
            </span>
        </button>
    );
};

const TransactionsTab: React.FC<TransactionsTabProps> = ({
    monthlyBudgetPocket,
    onTutupAnggaran,
    categoryTotals,
    categoryFilter,
    setCategoryFilter,
    filters,
    handleFilterChange,
    handleDownloadTransactionsCSV,
    filteredSummary,
    filteredTransactions,
    getTransactionSubDescription,
    onOpenModal,
    onDeleteTransaction,
    hasMore,
    loadMoreTransactions,
    isLoadingMore
}) => {
    const [mobileDateFilterOpen, setMobileDateFilterOpen] = useState(false);

    const allIncomeTotal: number = Object.keys(categoryTotals.income).reduce(
        (sum: number, key: string) => sum + categoryTotals.income[key],
        0
    );
    const allExpenseTotal: number = Object.keys(categoryTotals.expense).reduce(
        (sum: number, key: string) => sum + categoryTotals.expense[key],
        0
    );

    const activeDateCount = [filters.dateFrom, filters.dateTo].filter(Boolean).length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
            {/* Left Column: Category Filters & Budget */}
            <div className="lg:col-span-1">
                <MobileCollapsibleSection
                    title="Filter Kategori & Anggaran"
                    subtitle={
                        categoryFilter.type === 'all'
                            ? 'Semua Kategori'
                            : `${categoryFilter.type === TransactionType.INCOME ? 'Pemasukan' : 'Pengeluaran'}: ${categoryFilter.category}`
                    }
                    variant="filter"
                    actionLabelOpen="Lihat Kategori"
                    actionLabelClose="Tutup"
                >
                    <div className="space-y-4">
                        {monthlyBudgetPocket && (
                            <div className="bg-white p-3 sm:p-5 rounded-2xl shadow-[0_9px_17.5px_rgba(0,0,0,0.05)] border border-[#EAEFF4]">
                                <h4 className="font-bold text-sm text-[#2A3547] mb-2">{monthlyBudgetPocket.name}</h4>
                                <p className="text-2xl font-bold text-[#5D87FF]">{formatCurrency(monthlyBudgetPocket.amount)}</p>
                                <p className="text-xs text-[#5A6A85] font-medium mt-1">
                                    dari {formatCurrency(monthlyBudgetPocket.goalAmount || 0)}
                                </p>
                                <button onClick={onTutupAnggaran} className="w-full min-h-[44px] mt-3 bg-[#ECF2FF] hover:bg-[#d8e6ff] text-[#5D87FF] font-bold rounded-xl py-2 text-xs transition-all">
                                    Tutup & Simpan Sisa
                                </button>
                            </div>
                        )}
                        <div className="bg-gradient-to-br from-[#F3FFF9] to-white p-3 sm:p-4 rounded-2xl shadow-[0_9px_17.5px_rgba(0,0,0,0.05)] border border-[#B8EBD5]">
                            <h4 className="font-black text-xs uppercase tracking-wider text-[#0F8A64] mb-2 px-2">Pemasukan</h4>
                            <div className="space-y-1.5">
                                <CategoryButton
                                    type={TransactionType.INCOME}
                                    categoryName="Semua"
                                    amount={allIncomeTotal}
                                    isActive={categoryFilter.type === TransactionType.INCOME && categoryFilter.category === 'Semua'}
                                    onClick={() => setCategoryFilter({ type: TransactionType.INCOME, category: 'Semua' })}
                                />
                                {Object.entries(categoryTotals.income).map(([name, amount]: [string, number]) => (
                                    <CategoryButton
                                        key={name}
                                        type={TransactionType.INCOME}
                                        categoryName={name}
                                        amount={amount}
                                        isActive={categoryFilter.type === TransactionType.INCOME && categoryFilter.category === name}
                                        onClick={() => setCategoryFilter({ type: TransactionType.INCOME, category: name })}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#FFF5F2] to-white p-3 sm:p-4 rounded-2xl shadow-[0_9px_17.5px_rgba(0,0,0,0.05)] border border-[#F7C5B8]">
                            <h4 className="font-black text-xs uppercase tracking-wider text-[#D75C45] mb-2 px-2">Pengeluaran</h4>
                            <div className="space-y-1.5">
                                <CategoryButton
                                    type={TransactionType.EXPENSE}
                                    categoryName="Semua"
                                    amount={allExpenseTotal}
                                    isActive={categoryFilter.type === TransactionType.EXPENSE && categoryFilter.category === 'Semua'}
                                    onClick={() => setCategoryFilter({ type: TransactionType.EXPENSE, category: 'Semua' })}
                                />
                                {Object.entries(categoryTotals.expense).map(([name, amount]: [string, number]) => (
                                    <CategoryButton
                                        key={name}
                                        type={TransactionType.EXPENSE}
                                        categoryName={name}
                                        amount={amount}
                                        isActive={categoryFilter.type === TransactionType.EXPENSE && categoryFilter.category === name}
                                        onClick={() => setCategoryFilter({ type: TransactionType.EXPENSE, category: name })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </MobileCollapsibleSection>
            </div>

            {/* Right Column: Main Content */}
            <div className="lg:col-span-3 bg-white p-3 sm:p-6 rounded-2xl shadow-[0_9px_17.5px_rgba(0,0,0,0.05)] border border-[#EAEFF4]">
                {/* Mobile Compact Search & Filter Toggle */}
                <div className="flex sm:hidden items-center gap-2 mb-3">
                    <input
                        name="searchTerm"
                        value={filters.searchTerm}
                        onChange={handleFilterChange}
                        placeholder="Cari deskripsi, kategori..."
                        className="flex-1 min-w-0 bg-[#F4F6F9] border border-[#EAEFF4] rounded-xl px-2.5 py-2 text-xs text-[#2A3547] placeholder:text-[#5A6A85]/60 focus:outline-none focus:border-[#5D87FF]"
                    />
                    <button
                        type="button"
                        onClick={() => setMobileDateFilterOpen(prev => !prev)}
                        className={`px-2.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1 shrink-0 transition-all ${
                            mobileDateFilterOpen || activeDateCount > 0
                                ? 'bg-[#ECF2FF] border-[#5D87FF]/30 text-[#5D87FF]'
                                : 'bg-[#F4F6F9] border-[#EAEFF4] text-[#5A6A85]'
                        }`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>{mobileDateFilterOpen ? 'Tutup' : 'Tanggal'}</span>
                        {activeDateCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-[#5D87FF] text-white text-[9px] font-bold">
                                {activeDateCount}
                            </span>
                        )}
                        {mobileDateFilterOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    <button
                        onClick={handleDownloadTransactionsCSV}
                        className="bg-[#ECF2FF] text-[#5D87FF] p-2 rounded-xl inline-flex items-center justify-center shrink-0"
                        title="Unduh CSV"
                    >
                        <DownloadIcon className="w-3.5 h-3.5" />
                    </button>
                </div>

                {mobileDateFilterOpen && (
                    <div className="sm:hidden grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-[#EAEFF4] animate-fade-in">
                        <input
                            name="dateFrom"
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                            type="date"
                            className="w-full min-w-0 bg-[#F4F6F9] border border-[#EAEFF4] rounded-xl px-2 py-2 text-xs text-[#2A3547]"
                            title="Dari Tanggal"
                        />
                        <input
                            name="dateTo"
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                            type="date"
                            className="w-full min-w-0 bg-[#F4F6F9] border border-[#EAEFF4] rounded-xl px-2 py-2 text-xs text-[#2A3547]"
                            title="Sampai Tanggal"
                        />
                    </div>
                )}

                {/* Desktop Filter Row (Unchanged) */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4 items-end">
                    <input
                        name="searchTerm"
                        value={filters.searchTerm}
                        onChange={handleFilterChange}
                        placeholder="Cari deskripsi, kategori..."
                        className="col-span-2 md:col-span-1 min-w-0 bg-white border border-[#EAEFF4] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2A3547] placeholder:text-[#5A6A85]/60 focus:outline-none focus:border-[#5D87FF] transition-all"
                    />
                    <input
                        name="dateFrom"
                        value={filters.dateFrom}
                        onChange={handleFilterChange}
                        type="date"
                        className="w-full min-w-0 bg-white border border-[#EAEFF4] rounded-xl px-2 sm:px-3 py-2 text-xs sm:text-sm text-[#2A3547] focus:outline-none focus:border-[#5D87FF] transition-all"
                        title="Dari Tanggal"
                        aria-label="Dari Tanggal"
                    />
                    <input
                        name="dateTo"
                        value={filters.dateTo}
                        onChange={handleFilterChange}
                        type="date"
                        className="w-full min-w-0 bg-white border border-[#EAEFF4] rounded-xl px-2 sm:px-3 py-2 text-xs sm:text-sm text-[#2A3547] focus:outline-none focus:border-[#5D87FF] transition-all"
                        title="Sampai Tanggal"
                        aria-label="Sampai Tanggal"
                    />
                    <div className="non-printable col-span-2 flex md:col-span-1 md:justify-end">
                        <button
                            onClick={handleDownloadTransactionsCSV}
                            className="bg-[#ECF2FF] hover:bg-[#d8e6ff] text-[#5D87FF] font-bold rounded-xl inline-flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 text-xs sm:text-sm transition-all"
                        >
                            <DownloadIcon className="w-4 h-4 flex-shrink-0" /> Unduh CSV
                        </button>
                    </div>
                </div>

                {/* Summary strip: compact 3-col on mobile */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 p-2.5 sm:p-4 bg-[#F4F6F9] rounded-xl border border-[#EAEFF4]">
                    <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold text-[#5A6A85] truncate">Pemasukan</p>
                        <p className="text-xs sm:text-lg font-bold text-[#166534] truncate">{formatCurrency(filteredSummary.income)}</p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold text-[#5A6A85] truncate">Pengeluaran</p>
                        <p className="text-xs sm:text-lg font-bold text-[#DC2626] truncate">{formatCurrency(filteredSummary.expense)}</p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold text-[#5A6A85] truncate">Laba/Rugi</p>
                        <p className={`text-xs sm:text-lg font-bold truncate ${filteredSummary.net >= 0 ? 'text-[#166534]' : 'text-[#DC2626]'}`}>{formatCurrency(filteredSummary.net)}</p>
                    </div>
                </div>

                {/* Mobile table */}
                <div className="md:hidden overflow-x-auto rounded-xl border border-[#EAEFF4]">
                    <table className="w-full min-w-[340px] table-fixed border-collapse text-left">
                        <thead className="bg-[#F4F6F9]/80 text-[#5A6A85]">
                            <tr>
                                <th className="w-[66px] border-r border-[#EAEFF4] !px-2 !py-2 !text-[10px] font-bold">Tanggal</th>
                                <th className="border-r border-[#EAEFF4] !px-2 !py-2 !text-[10px] font-bold">Deskripsi</th>
                                <th className="w-[96px] border-r border-[#EAEFF4] !px-2 !py-2 text-right !text-[10px] font-bold">Jumlah</th>
                                <th className="w-[68px] !px-1 !py-2 text-center !text-[10px] font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => {
                                const subDescription = getTransactionSubDescription(t);
                                return (
                                    <tr key={t.id} className="border-t border-[#EAEFF4]">
                                        <td className="border-r border-[#EAEFF4] !px-2 !py-2 align-top whitespace-nowrap !text-[10px] text-[#5A6A85]">
                                            {new Date(t.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="border-r border-[#EAEFF4] !px-2 !py-2 align-top">
                                            <p className="!text-[11px] font-bold leading-tight text-[#2A3547] break-words">{t.description}</p>
                                            <p className="!text-[10px] leading-tight text-[#5A6A85] break-words">
                                                {t.category || '-'}{subDescription ? ` • ${subDescription}` : ''}
                                            </p>
                                        </td>
                                        <td className={`border-r border-[#EAEFF4] !px-2 !py-2 align-top text-right whitespace-nowrap !text-[10px] font-bold tabular-nums ${t.type === TransactionType.INCOME ? 'text-[#166534]' : 'text-[#DC2626]'}`}>
                                            {formatCurrency(t.amount)}
                                        </td>
                                        <td className="!px-1 !py-2 align-top">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onOpenModal('transaction', 'edit', t)}
                                                    className="w-7 h-7 min-w-7 min-h-7 rounded-lg border border-[#EAEFF4] bg-white text-[#FFAE1F] flex items-center justify-center"
                                                    title="Edit Transaksi"
                                                    aria-label="Edit Transaksi"
                                                >
                                                    <PencilIcon className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) onDeleteTransaction(t.id); }}
                                                    className="w-7 h-7 min-w-7 min-h-7 rounded-lg border border-[#EAEFF4] bg-white text-[#FA896B] flex items-center justify-center"
                                                    title="Hapus Transaksi"
                                                    aria-label="Hapus Transaksi"
                                                >
                                                    <Trash2Icon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="!px-3 !py-5 text-center !text-[11px] text-[#5A6A85]">Tidak ada transaksi yang cocok.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-xs lg:text-sm">
                        <thead className="text-xs text-[#5A6A85] uppercase bg-[#F4F6F9]/80 border-b border-[#EAEFF4]">
                            <tr>
                                <th className="p-3 font-bold text-center w-12">No</th>
                                <th className="p-3 font-bold text-left">Tanggal</th>
                                <th className="p-3 font-bold text-left">Deskripsi</th>
                                <th className="p-3 font-bold text-left">Kategori</th>
                                <th className="p-3 font-bold text-right">Jumlah</th>
                                <th className="p-3 font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAEFF4]">
                            {filteredTransactions.map((t, index) => {
                                const subDescription = getTransactionSubDescription(t);
                                return (
                                    <tr key={t.id} className="hover:bg-[#F4F6F9]/50 transition-colors">
                                        <td className="p-3 text-center text-[#5A6A85] font-bold">{index + 1}</td>
                                        <td className="p-3 text-[#5A6A85] font-medium whitespace-nowrap">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                                        <td className="p-3">
                                            <p className="font-bold text-[#2A3547]">{t.description}</p>
                                            {subDescription && <p className="text-xs text-[#5A6A85] font-medium">{subDescription}</p>}
                                        </td>
                                        <td className="p-3">
                                            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#F4F6F9] text-[#5A6A85] rounded-full">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td
                                            className={`p-3 text-right font-bold ${
                                                t.type === TransactionType.INCOME ? 'text-[#166534]' : 'text-[#DC2626]'
                                            }`}
                                        >
                                            {formatCurrency(t.amount)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onOpenModal('transaction', 'edit', t); }}
                                                    className="w-8 h-8 rounded-xl bg-[#FEF5E5] hover:bg-[#FFAE1F] text-[#FFAE1F] hover:text-white flex items-center justify-center transition-all"
                                                    title="Edit Transaksi"
                                                >
                                                    <PencilIcon className="w-4 h-4 flex-shrink-0" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) onDeleteTransaction(t.id); }}
                                                    className="w-8 h-8 rounded-xl bg-[#FDEDE8] hover:bg-[#FA896B] text-[#FA896B] hover:text-white flex items-center justify-center transition-all"
                                                    title="Hapus Transaksi"
                                                >
                                                    <Trash2Icon className="w-4 h-4 flex-shrink-0" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredTransactions.length === 0 && (
                        <p className="text-center py-10 text-[#5A6A85] text-sm">Tidak ada transaksi yang cocok.</p>
                    )}
                </div>

                {hasMore && filteredTransactions.length >= 10 && (
                    <div className="mt-6 flex justify-center pb-2">
                        <button
                            onClick={loadMoreTransactions}
                            disabled={isLoadingMore}
                            className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ECF2FF] hover:bg-[#d8e6ff] text-[#5D87FF] font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
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
        </div>
    );
};

export default TransactionsTab;
